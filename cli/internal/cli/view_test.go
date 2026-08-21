package cli

import (
	"bytes"
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
	"net/http/httptest"
	"os"
	"path/filepath"
	"strings"
	"testing"

	"github.com/dhdtech/ooshare.io/cli/internal/crypto"
)

// errReader is an io.Reader that always fails, to exercise stdin error branches.
type errReader struct{}

func (errReader) Read([]byte) (int, error) { return 0, errors.New("injected read error") }

// makeSecret returns (ciphertext, url, key) for a text-only secret using fixed key/id.
func makeSecret(t *testing.T, text string) (string, string, []byte) {
	t.Helper()
	key := bytes.Repeat([]byte{0x5a}, 32)
	id := "10000000-1000-4000-8000-100000000000"
	payload, err := crypto.EncodePayload(text, nil)
	if err != nil {
		t.Fatal(err)
	}
	ct, err := crypto.Encrypt(payload, key, id)
	if err != nil {
		t.Fatal(err)
	}
	return ct, "https://ooshare.io/s/" + id + "?lng=en#" + crypto.Base64urlEncode(key), key
}

func TestViewText(t *testing.T) {
	ct, u, _ := makeSecret(t, "the secret text")
	srv := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.URL.Path != "/api/secrets/10000000-1000-4000-8000-100000000000" {
			t.Fatalf("path = %q", r.URL.Path)
		}
		fmt.Fprintf(w, `{"ciphertext":%q,"id":"10000000-1000-4000-8000-100000000000"}`, ct)
	}))
	defer srv.Close()
	var out, errw bytes.Buffer
	code := View(&out, &errw, []string{"--api-url", srv.URL, u})
	if code != 0 {
		t.Fatalf("exit = %d, stderr = %q", code, errw.String())
	}
	if strings.TrimSpace(out.String()) != "the secret text" {
		t.Fatalf("stdout = %q", out.String())
	}
}

func TestViewDecryptsAgainstReturnedUUID(t *testing.T) {
	// Secret was encrypted against the real UUID; the URL uses an alias.
	key := bytes.Repeat([]byte{0x5a}, 32)
	realID := "10000000-1000-4000-8000-100000000000"
	payload, _ := crypto.EncodePayload("via alias", nil)
	ct, err := crypto.Encrypt(payload, key, realID)
	if err != nil {
		t.Fatal(err)
	}
	u := "https://ooshare.io/s/Kx7mP2nQ?lng=en#" + crypto.Base64urlEncode(key)
	srv := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.URL.Path != "/api/secrets/Kx7mP2nQ" {
			t.Fatalf("path = %q", r.URL.Path)
		}
		fmt.Fprintf(w, `{"ciphertext":%q,"id":%q}`, ct, realID)
	}))
	defer srv.Close()
	var out, errw bytes.Buffer
	if code := View(&out, &errw, []string{"--api-url", srv.URL, u}); code != 0 {
		t.Fatalf("exit = %d, stderr = %q", code, errw.String())
	}
	if strings.TrimSpace(out.String()) != "via alias" {
		t.Fatalf("stdout = %q", out.String())
	}
}

func TestViewWritesAttachmentToDisk(t *testing.T) {
	key := bytes.Repeat([]byte{0x5a}, 32)
	id := "10000000-1000-4000-8000-100000000000"
	payload, err := crypto.EncodePayload("caption", &crypto.ImageAttachment{MIME: "application/pdf", Data: []byte{1, 2, 3}})
	if err != nil {
		t.Fatal(err)
	}
	ct, err := crypto.Encrypt(payload, key, id)
	if err != nil {
		t.Fatal(err)
	}
	u := "https://ooshare.io/s/" + id + "?lng=en#" + crypto.Base64urlEncode(key)
	srv := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprintf(w, `{"ciphertext":%q,"id":%q}`, ct, id)
	}))
	defer srv.Close()
	dir := t.TempDir()
	var out, errw bytes.Buffer
	code := View(&out, &errw, []string{"--api-url", srv.URL, "--output", dir, u})
	if code != 0 {
		t.Fatalf("exit = %d, stderr = %q", code, errw.String())
	}
	if strings.TrimSpace(out.String()) != "caption" {
		t.Fatalf("stdout = %q", out.String())
	}
	got, err := os.ReadFile(filepath.Join(dir, "secret.pdf"))
	if err != nil {
		t.Fatal(err)
	}
	if !bytes.Equal(got, []byte{1, 2, 3}) {
		t.Fatalf("file bytes = %v", got)
	}
}

func TestViewJSON(t *testing.T) {
	ct, u, _ := makeSecret(t, "hello")
	srv := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprintf(w, `{"ciphertext":%q,"id":"10000000-1000-4000-8000-100000000000"}`, ct)
	}))
	defer srv.Close()
	var out, errw bytes.Buffer
	code := View(&out, &errw, []string{"--api-url", srv.URL, "--json", u})
	if code != 0 {
		t.Fatalf("exit = %d", code)
	}
	var got struct {
		Schema int    `json:"schema"`
		Text   string `json:"text"`
	}
	if err := json.Unmarshal(out.Bytes(), &got); err != nil {
		t.Fatalf("stdout not JSON: %v", err)
	}
	if got.Schema != 1 || got.Text != "hello" {
		t.Fatalf("parsed = %+v", got)
	}
}

func TestViewNotFoundExits1(t *testing.T) {
	srv := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusNotFound)
		fmt.Fprint(w, `{"error":"Secret not found or already viewed"}`)
	}))
	defer srv.Close()
	var out, errw bytes.Buffer
	code := View(&out, &errw, []string{"--api-url", srv.URL, "https://ooshare.io/s/Kx7mP2nQ#AAECAwQFBgcICQoLDA0ODxAREhMUFRYXGBkaGxwdHh8"})
	if code != 1 {
		t.Fatalf("exit = %d, want 1", code)
	}
	if !strings.Contains(errw.String(), "not found") {
		t.Fatalf("stderr = %q", errw.String())
	}
}

func TestDerivedName(t *testing.T) {
	cases := map[string]string{
		"image/jpeg":                   "secret.jpg",
		"image/png":                    "secret.png",
		"image/gif":                    "secret.gif",
		"image/webp":                   "secret.webp",
		"application/pdf":              "secret.pdf",
		"application/zip":              "secret.zip",
		"application/x-zip-compressed": "secret.zip",
		"application/vnd.rar":          "secret.rar",
		"application/x-rar-compressed": "secret.rar",
		"application/x-7z-compressed":  "secret.7z",
		"application/gzip":             "secret.tar.gz",
		"application/x-tar":            "secret.tar",
		"application/octet-stream":     "secret.bin",
		"":                             "secret.bin",
	}
	for mime, want := range cases {
		if got := derivedName(mime); got != want {
			t.Fatalf("derivedName(%q) = %q, want %q", mime, got, want)
		}
	}
}

func TestViewDecryptFailureWrongKeyExits1(t *testing.T) {
	key := bytes.Repeat([]byte{0x5a}, 32)
	id := "10000000-1000-4000-8000-100000000000"
	payload, _ := crypto.EncodePayload("secret", nil)
	ct, err := crypto.Encrypt(payload, key, id)
	if err != nil {
		t.Fatal(err)
	}
	srv := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprintf(w, `{"ciphertext":%q,"id":%q}`, ct, id)
	}))
	defer srv.Close()
	// Wrong key in the URL fragment.
	u := "https://ooshare.io/s/" + id + "?lng=en#" + crypto.Base64urlEncode(bytes.Repeat([]byte{0x7b}, 32))
	var out, errw bytes.Buffer
	if code := View(&out, &errw, []string{"--api-url", srv.URL, u}); code != 1 {
		t.Fatalf("exit = %d, want 1", code)
	}
	if !strings.Contains(errw.String(), "decrypt") && !strings.Contains(errw.String(), "wrong key") {
		t.Fatalf("stderr = %q", errw.String())
	}
}

func TestViewOutputExistingDir(t *testing.T) {
	key := bytes.Repeat([]byte{0x5a}, 32)
	id := "10000000-1000-4000-8000-100000000000"
	payload, err := crypto.EncodePayload("cap", &crypto.ImageAttachment{MIME: "image/png", Data: []byte{0x89, 0x50}})
	if err != nil {
		t.Fatal(err)
	}
	ct, err := crypto.Encrypt(payload, key, id)
	if err != nil {
		t.Fatal(err)
	}
	u := "https://ooshare.io/s/" + id + "?lng=en#" + crypto.Base64urlEncode(key)
	srv := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprintf(w, `{"ciphertext":%q,"id":%q}`, ct, id)
	}))
	defer srv.Close()
	// Existing directory, but referenced WITHOUT a trailing slash: exercises the
	// os.Stat(isDir) branch in writeAttachment.
	dir := t.TempDir()
	var out, errw bytes.Buffer
	if code := View(&out, &errw, []string{"--api-url", srv.URL, "--output", dir, u}); code != 0 {
		t.Fatalf("exit = %d, stderr = %q", code, errw.String())
	}
	got, err := os.ReadFile(filepath.Join(dir, "secret.png"))
	if err != nil {
		t.Fatal(err)
	}
	if !bytes.Equal(got, []byte{0x89, 0x50}) {
		t.Fatalf("file bytes = %v", got)
	}
}

func TestViewJSONStdoutAttachmentExits2(t *testing.T) {
	// Secret WITH an attachment, but --json --output - : JSON and raw bytes
	// cannot both go to stdout, so the command must refuse (not drop bytes).
	key := bytes.Repeat([]byte{0x5a}, 32)
	id := "10000000-1000-4000-8000-100000000000"
	payload, err := crypto.EncodePayload("cap", &crypto.ImageAttachment{MIME: "image/png", Data: []byte{0x89, 0x50}})
	if err != nil {
		t.Fatal(err)
	}
	ct, err := crypto.Encrypt(payload, key, id)
	if err != nil {
		t.Fatal(err)
	}
	u := "https://ooshare.io/s/" + id + "?lng=en#" + crypto.Base64urlEncode(key)
	srv := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprintf(w, `{"ciphertext":%q,"id":%q}`, ct, id)
	}))
	defer srv.Close()
	var out, errw bytes.Buffer
	code := View(&out, &errw, []string{"--api-url", srv.URL, "--json", "--output", "-", u})
	if code != 2 {
		t.Fatalf("exit = %d, want 2", code)
	}
	if !strings.Contains(errw.String(), "cannot be combined") {
		t.Fatalf("stderr = %q", errw.String())
	}
	if out.Len() != 0 {
		t.Fatalf("stdout should be empty on refusal, got %q", out.String())
	}
}

func TestViewJSONWithAttachment(t *testing.T) {
	key := bytes.Repeat([]byte{0x5a}, 32)
	id := "10000000-1000-4000-8000-100000000000"
	payload, err := crypto.EncodePayload("cap", &crypto.ImageAttachment{MIME: "image/png", Data: []byte{0x89, 0x50}})
	if err != nil {
		t.Fatal(err)
	}
	ct, err := crypto.Encrypt(payload, key, id)
	if err != nil {
		t.Fatal(err)
	}
	u := "https://ooshare.io/s/" + id + "?lng=en#" + crypto.Base64urlEncode(key)
	srv := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprintf(w, `{"ciphertext":%q,"id":%q}`, ct, id)
	}))
	defer srv.Close()
	dir := t.TempDir()
	var out, errw bytes.Buffer
	if code := View(&out, &errw, []string{"--api-url", srv.URL, "--json", "--output", dir, u}); code != 0 {
		t.Fatalf("exit = %d, stderr = %q", code, errw.String())
	}
	var got struct {
		Schema     int    `json:"schema"`
		Text       string `json:"text"`
		Attachment struct {
			Path string `json:"path"`
			MIME string `json:"mime"`
			Size int    `json:"size"`
		} `json:"attachment"`
	}
	if err := json.Unmarshal(out.Bytes(), &got); err != nil {
		t.Fatalf("stdout not JSON: %v", err)
	}
	if got.Schema != 1 || got.Text != "cap" {
		t.Fatalf("parsed = %+v", got)
	}
	if got.Attachment.Path != filepath.Join(dir, "secret.png") || got.Attachment.MIME != "image/png" || got.Attachment.Size != 2 {
		t.Fatalf("attachment = %+v", got.Attachment)
	}
}

func TestViewDecodePayloadErrorExits1(t *testing.T) {
	key := bytes.Repeat([]byte{0x5a}, 32)
	id := "10000000-1000-4000-8000-100000000000"
	// Payload is just a type byte 0x01 with no header -> DecodePayload errors.
	ct, err := crypto.Encrypt([]byte{0x01}, key, id)
	if err != nil {
		t.Fatal(err)
	}
	u := "https://ooshare.io/s/" + id + "?lng=en#" + crypto.Base64urlEncode(key)
	srv := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprintf(w, `{"ciphertext":%q,"id":%q}`, ct, id)
	}))
	defer srv.Close()
	var out, errw bytes.Buffer
	if code := View(&out, &errw, []string{"--api-url", srv.URL, u}); code != 1 {
		t.Fatalf("exit = %d, want 1", code)
	}
}

func TestViewMultipleURLsExits2(t *testing.T) {
	var out, errw bytes.Buffer
	if code := View(&out, &errw, []string{"url1", "url2"}); code != 2 {
		t.Fatalf("exit = %d, want 2", code)
	}
}

func TestViewStdinReadErrorExits1(t *testing.T) {
	old := stdin
	defer func() { stdin = old }()
	stdin = &errReader{}
	var out, errw bytes.Buffer
	if code := View(&out, &errw, []string{}); code != 1 {
		t.Fatalf("exit = %d, want 1", code)
	}
}

func TestWarnInsecureInvalidURLNoWarning(t *testing.T) {
	var errw bytes.Buffer
	// A malformed --api-url must not panic or print a warning (parse fails early).
	warnInsecure(&errw, "://bad url")
	if errw.Len() != 0 {
		t.Fatalf("expected no warning, stderr = %q", errw.String())
	}
}

func TestWriteAttachmentWriteError(t *testing.T) {
	// Pre-create the destination name as a directory so os.WriteFile fails.
	dir := t.TempDir()
	dst := filepath.Join(dir, "secret.png")
	if err := os.Mkdir(dst, 0o755); err != nil {
		t.Fatal(err)
	}
	// output is the parent dir with trailing slash -> path becomes dst (a dir).
	var out bytes.Buffer
	img := &crypto.ImageAttachment{MIME: "image/png", Data: []byte{1}}
	if _, err := writeAttachment(img, dir+string(os.PathSeparator), &out); err == nil {
		t.Fatal("expected WriteFile error")
	}
}

func TestWriteAttachmentMkdirError(t *testing.T) {
	// --output points inside an existing regular file, so MkdirAll must fail.
	blk := filepath.Join(t.TempDir(), "blocker")
	if err := os.WriteFile(blk, []byte("x"), 0o600); err != nil {
		t.Fatal(err)
	}
	img := &crypto.ImageAttachment{MIME: "image/png", Data: []byte{1}}
	var out bytes.Buffer
	if _, err := writeAttachment(img, filepath.Join(blk, "sub", "secret.png"), &out); err == nil {
		t.Fatal("expected MkdirAll error")
	}
}

func TestViewUnknownFlagExits2(t *testing.T) {
	var out, errw bytes.Buffer
	if code := View(&out, &errw, []string{"--bogus"}); code != 2 {
		t.Fatalf("exit = %d, want 2", code)
	}
}

func TestViewMalformedURLExits2(t *testing.T) {
	var out, errw bytes.Buffer
	if code := View(&out, &errw, []string{"not-a-url"}); code != 2 {
		t.Fatalf("exit = %d, want 2", code)
	}
}

func TestViewJSONPrettyPrinted(t *testing.T) {
	ct, u, _ := makeSecret(t, "hello")
	srv := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprintf(w, `{"ciphertext":%q,"id":"10000000-1000-4000-8000-100000000000"}`, ct)
	}))
	defer srv.Close()
	var out, errw bytes.Buffer
	code := View(&out, &errw, []string{"--api-url", srv.URL, "--json", u})
	if code != 0 {
		t.Fatalf("exit = %d", code)
	}
	if !strings.Contains(out.String(), "\n  \"schema\": 1") {
		t.Fatalf("view --json should be 2-space indented, got:\n%s", out.String())
	}
	var parsed struct {
		Text string `json:"text"`
	}
	if err := json.Unmarshal(out.Bytes(), &parsed); err != nil {
		t.Fatalf("pretty JSON does not parse: %v", err)
	}
	if parsed.Text != "hello" {
		t.Fatalf("text = %q", parsed.Text)
	}
}
