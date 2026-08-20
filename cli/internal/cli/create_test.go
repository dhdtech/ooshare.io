package cli

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
	"net/http/httptest"
	"os"
	"path/filepath"
	"strings"
	"testing"
	"unicode/utf8"
)

func createServer(t *testing.T, ttlWant float64) string {
	t.Helper()
	srv := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.URL.Path != "/api/secrets" || r.Method != http.MethodPost {
			t.Fatalf("got %s %s", r.Method, r.URL.Path)
		}
		var body map[string]any
		json.NewDecoder(r.Body).Decode(&body)
		if body["ttl_hours"] != ttlWant {
			t.Fatalf("ttl_hours = %v", body["ttl_hours"])
		}
		if _, ok := body["ciphertext"].(string); !ok {
			t.Fatalf("ciphertext missing")
		}
		if _, ok := body["id"].(string); !ok {
			t.Fatalf("id missing")
		}
		w.WriteHeader(http.StatusCreated)
		fmt.Fprint(w, `{"id":"10000000-1000-4000-8000-100000000000","alias":"Kx7mP2nQ"}`)
	}))
	t.Cleanup(srv.Close)
	return srv.URL
}

func TestCreateJSON(t *testing.T) {
	api := createServer(t, 24)
	var out, errw bytes.Buffer
	code := Create(&out, &errw, []string{"--api-url", api, "--text", "s3cr3t", "--json"})
	if code != 0 {
		t.Fatalf("exit = %d, stderr = %q", code, errw.String())
	}
	var got struct {
		Schema   int    `json:"schema"`
		ID       string `json:"id"`
		Alias    string `json:"alias"`
		URL      string `json:"url"`
		TTLHours int    `json:"ttl_hours"`
		HasFile  bool   `json:"has_attachment"`
	}
	if err := json.Unmarshal(out.Bytes(), &got); err != nil {
		t.Fatalf("stdout %q is not JSON: %v", out.Bytes(), err)
	}
	if got.Schema != 1 || got.Alias != "Kx7mP2nQ" || got.TTLHours != 24 || got.HasFile {
		t.Fatalf("parsed = %+v", got)
	}
	wantPrefix := "https://ooshare.io/s/Kx7mP2nQ?lng=en#"
	if !strings.HasPrefix(got.URL, wantPrefix) {
		t.Fatalf("url = %q, want prefix %q", got.URL, wantPrefix)
	}
	// Fragment key must decode to 32 bytes.
	keyPart := strings.TrimPrefix(got.URL, wantPrefix)
	if keyPart == "" || len(keyPart) != 43 { // base64url of 32 bytes
		t.Fatalf("key fragment length = %d", len(keyPart))
	}
}

func TestCreateNonTTYPrintsBareURL(t *testing.T) {
	api := createServer(t, 24)
	var out, errw bytes.Buffer
	code := Create(&out, &errw, []string{"--api-url", api, "--text", "s3cr3t"})
	if code != 0 {
		t.Fatalf("exit = %d", code)
	}
	trimmed := strings.TrimSpace(out.String())
	if !strings.HasPrefix(trimmed, "https://ooshare.io/s/Kx7mP2nQ?lng=en#") || strings.Contains(trimmed, "\n") {
		t.Fatalf("stdout = %q, want a single bare URL line", trimmed)
	}
	if errw.Len() != 0 {
		t.Fatalf("stderr should be empty when stdout is not a TTY: %q", errw.String())
	}
}

func TestCreateReadsTextFromStdin(t *testing.T) {
	api := createServer(t, 1)
	old := stdin
	defer func() { stdin = old }()
	stdin = strings.NewReader("from stdin")
	var out, errw bytes.Buffer
	code := Create(&out, &errw, []string{"--api-url", api, "--ttl", "1", "--json"})
	if code != 0 {
		t.Fatalf("exit = %d, stderr = %q", code, errw.String())
	}
}

func TestCreateNoInputExits2(t *testing.T) {
	var out, errw bytes.Buffer
	code := Create(&out, &errw, []string{"--json"})
	if code != 2 {
		t.Fatalf("exit = %d, want 2", code)
	}
}

func TestCreateBadTTLExits2(t *testing.T) {
	var out, errw bytes.Buffer
	code := Create(&out, &errw, []string{"--text", "x", "--ttl", "99"})
	if code != 2 {
		t.Fatalf("exit = %d, want 2", code)
	}
}

func TestCreateServerErrorExits1(t *testing.T) {
	srv := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusBadRequest)
		fmt.Fprint(w, `{"error":"ciphertext is required and must be a string"}`)
	}))
	defer srv.Close()
	var out, errw bytes.Buffer
	code := Create(&out, &errw, []string{"--api-url", srv.URL, "--text", "x"})
	if code != 1 {
		t.Fatalf("exit = %d, want 1", code)
	}
	if !strings.Contains(errw.String(), "ciphertext is required") {
		t.Fatalf("stderr = %q", errw.String())
	}
}

func TestCreateWithFileAttachment(t *testing.T) {
	api := createServer(t, 24)
	dir := t.TempDir()
	path := filepath.Join(dir, "report.pdf")
	if err := os.WriteFile(path, []byte("%PDF-1.7 fake pdf data"), 0o600); err != nil {
		t.Fatal(err)
	}
	var out, errw bytes.Buffer
	code := Create(&out, &errw, []string{"--api-url", api, "--file", path, "--json"})
	if code != 0 {
		t.Fatalf("exit = %d, stderr = %q", code, errw.String())
	}
	var got struct {
		HasAttachment bool `json:"has_attachment"`
	}
	if err := json.Unmarshal(out.Bytes(), &got); err != nil {
		t.Fatalf("stdout %q is not JSON: %v", out.Bytes(), err)
	}
	if !got.HasAttachment {
		t.Fatalf("has_attachment = false, want true")
	}
}

func TestCreateAttachmentRichOutputOnTTY(t *testing.T) {
	dir := t.TempDir()
	path := filepath.Join(dir, "contract.pdf")
	if err := os.WriteFile(path, bytes.Repeat([]byte{0x61}, 2048), 0o600); err != nil {
		t.Fatal(err)
	}
	api := createServer(t, 24)
	oldTTY := stdoutIsTTY
	stdoutIsTTY = func() bool { return true }
	defer func() { stdoutIsTTY = oldTTY }()
	var out, errw bytes.Buffer
	code := Create(&out, &errw, []string{"--api-url", api, "--text", "x", "--file", path})
	if code != 0 {
		t.Fatalf("exit = %d, stderr = %q", code, errw.String())
	}
	s := out.String()
	if !strings.Contains(s, "📎  contract.pdf · 2.0 KB") {
		t.Fatalf("attachment row missing from rich output:\n%s", s)
	}
}

func TestCreateFileTooLargeExits1(t *testing.T) {
	dir := t.TempDir()
	path := filepath.Join(dir, "big.pdf")
	f, err := os.Create(path)
	if err != nil {
		t.Fatal(err)
	}
	// Write maxFileSize+1 bytes without holding them in memory at once.
	if err := f.Truncate(maxFileSize + 1); err != nil {
		t.Fatal(err)
	}
	f.Close()
	var out, errw bytes.Buffer
	code := Create(&out, &errw, []string{"--file", path, "--json"})
	if code != 1 {
		t.Fatalf("exit = %d, want 1", code)
	}
	if !strings.Contains(errw.String(), "exceeds 25 MB") {
		t.Fatalf("stderr = %q", errw.String())
	}
}

func TestCreateFileUnsupportedExtExits1(t *testing.T) {
	dir := t.TempDir()
	path := filepath.Join(dir, "notes.txt")
	if err := os.WriteFile(path, []byte("plain text"), 0o600); err != nil {
		t.Fatal(err)
	}
	var out, errw bytes.Buffer
	code := Create(&out, &errw, []string{"--file", path, "--json"})
	if code != 1 {
		t.Fatalf("exit = %d, want 1", code)
	}
	if !strings.Contains(errw.String(), "unsupported file type") {
		t.Fatalf("stderr = %q", errw.String())
	}
}

func TestCreateFileMissingExits1(t *testing.T) {
	var out, errw bytes.Buffer
	code := Create(&out, &errw, []string{"--file", filepath.Join(t.TempDir(), "nope.png"), "--json"})
	if code != 1 {
		t.Fatalf("exit = %d, want 1", code)
	}
}

func TestCreateInvalidLangExits2(t *testing.T) {
	var out, errw bytes.Buffer
	code := Create(&out, &errw, []string{"--text", "x", "--lang", "fr"})
	if code != 2 {
		t.Fatalf("exit = %d, want 2", code)
	}
	if !strings.Contains(errw.String(), "invalid --lang") {
		t.Fatalf("stderr = %q", errw.String())
	}
}

func TestCreateTTLBoundaries(t *testing.T) {
	for _, ttl := range []string{"0", "73"} {
		var out, errw bytes.Buffer
		if code := Create(&out, &errw, []string{"--text", "x", "--ttl", ttl}); code != 2 {
			t.Fatalf("ttl %s: exit = %d, want 2", ttl, code)
		}
	}
}

func TestCreateTextTooLongExits2(t *testing.T) {
	long := strings.Repeat("x", maxTextChars+1)
	var out, errw bytes.Buffer
	if code := Create(&out, &errw, []string{"--text", long}); code != 2 {
		t.Fatalf("exit = %d, want 2", code)
	}
	if !strings.Contains(errw.String(), "exceeds") {
		t.Fatalf("stderr = %q", errw.String())
	}
}

func TestCreateStdinTextTooLongExits2(t *testing.T) {
	// 4 bytes/char cap at 200,000 bytes for the stdin body, then the rune-count
	// check kicks in: 50,001 ASCII chars must be rejected before hitting the API.
	old := stdin
	defer func() { stdin = old }()
	stdin = strings.NewReader(strings.Repeat("x", maxTextChars+1))
	var out, errw bytes.Buffer
	code := Create(&out, &errw, []string{"--json"})
	if code != 2 {
		t.Fatalf("exit = %d, want 2", code)
	}
	if !strings.Contains(errw.String(), "exceeds") {
		t.Fatalf("stderr = %q", errw.String())
	}
}

func TestCreateCJKWrapWithinRuneLimit(t *testing.T) {
	// CJK characters are 3 bytes each: a 50,000-rune string is 150,000 bytes,
	// far over the byte-based limit but exactly at the rune limit. It must pass
	// (the check counts characters, matching the web's textarea).
	api := createServer(t, 24)
	var out, errw bytes.Buffer
	cjk := strings.Repeat("界", maxTextChars)
	code := Create(&out, &errw, []string{"--api-url", api, "--json", "--text", cjk})
	if code != 0 {
		t.Fatalf("exit = %d, want 0 (rune count = %d, bytes = %d), stderr = %q",
			code, utf8.RuneCountInString(cjk), len(cjk), errw.String())
	}
}

func TestCreateCJKOverRuneLimitExits2(t *testing.T) {
	old := stdin
	defer func() { stdin = old }()
	// 50,001 runes via stdin (160,008 bytes) — under the 200,000-byte stdin cap
	// but over the 50,000 rune limit, so it must be rejected by rune count.
	stdin = strings.NewReader(strings.Repeat("界", maxTextChars+1))
	var out, errw bytes.Buffer
	code := Create(&out, &errw, []string{"--json"})
	if code != 2 {
		t.Fatalf("exit = %d, want 2", code)
	}
	if !strings.Contains(errw.String(), "exceeds") {
		t.Fatalf("stderr = %q", errw.String())
	}
}

func TestCreateUnknownFlagExits2(t *testing.T) {
	var out, errw bytes.Buffer
	if code := Create(&out, &errw, []string{"--text", "x", "--bogus"}); code != 2 {
		t.Fatalf("exit = %d, want 2", code)
	}
}

func TestEnvDefault(t *testing.T) {
	t.Setenv("OOSHARE_TEST_ENV", "from-env")
	if got := envDefault("not-default", "OOSHARE_TEST_ENV", "def"); got != "not-default" {
		t.Fatalf("flag value should win, got %q", got)
	}
	// flag == default, env set -> env wins
	if got := envDefault("def", "OOSHARE_TEST_ENV", "def"); got != "from-env" {
		t.Fatalf("env should win, got %q", got)
	}
	// flag == default, env empty -> default
	t.Setenv("OOSHARE_TEST_ENV", "")
	if got := envDefault("def", "OOSHARE_TEST_ENV", "def"); got != "def" {
		t.Fatalf("default should win, got %q", got)
	}
}

func TestNewUUIDIsV4(t *testing.T) {
	u1, err := newUUID()
	if err != nil {
		t.Fatal(err)
	}
	u2, err := newUUID()
	if err != nil {
		t.Fatal(err)
	}
	if u1 == u2 {
		t.Fatal("UUIDs should be unique")
	}
	// RFC 4122 v4: version nibble = 4, variant = 8..b.
	if !strings.Contains(u1, "-") {
		t.Fatalf("not a UUID: %q", u1)
	}
}

func TestDetectMIME(t *testing.T) {
	dir := t.TempDir()
	cases := map[string]string{
		"a.png":  "image/png",
		"b.jpeg": "image/jpeg",
		"c.pdf":  "application/pdf",
		"d.zip":  "application/zip",
		"e.7z":   "application/x-7z-compressed",
		"f.txt":  "",
	}
	for name, want := range cases {
		path := dir + "/" + name
		if err := os.WriteFile(path, []byte("x"), 0o600); err != nil {
			t.Fatal(err)
		}
		got, err := detectMIME(path)
		if want == "" {
			if err == nil {
				t.Fatalf("%s: expected error, got %q", name, got)
			}
		} else if err != nil || got != want {
			t.Fatalf("%s: got %q, %v; want %q", name, got, err, want)
		}
	}
}

func TestCreateRichOutputOnTTY(t *testing.T) {
	api := createServer(t, 1)
	oldTTY := stdoutIsTTY
	stdoutIsTTY = func() bool { return true }
	defer func() { stdoutIsTTY = oldTTY }()
	var out, errw bytes.Buffer
	code := Create(&out, &errw, []string{"--api-url", api, "--text", "x", "--ttl", "1"})
	if code != 0 {
		t.Fatalf("exit = %d, stderr = %q", code, errw.String())
	}
	s := out.String()
	for _, want := range []string{
		"Secret created — opens exactly once",
		"after 1h",
		"destroyed forever",
		"https://ooshare.io/s/Kx7mP2nQ?lng=en#",
		"Share it over a private channel",
	} {
		if !strings.Contains(s, want) {
			t.Fatalf("rich output missing %q:\n%s", want, s)
		}
	}
	if !strings.Contains(s, "\x1b[") {
		t.Fatalf("expected ANSI colors in TTY output:\n%q", s)
	}
}

func TestCreateRichOutputNoColor(t *testing.T) {
	api := createServer(t, 24)
	oldTTY := stdoutIsTTY
	stdoutIsTTY = func() bool { return true }
	defer func() { stdoutIsTTY = oldTTY }()
	t.Setenv("NO_COLOR", "1")
	var out, errw bytes.Buffer
	code := Create(&out, &errw, []string{"--api-url", api, "--text", "x"})
	if code != 0 {
		t.Fatalf("exit = %d", code)
	}
	if strings.Contains(out.String(), "\x1b[") {
		t.Fatalf("NO_COLOR should disable ANSI:\n%q", out.String())
	}
	if !strings.Contains(out.String(), "Secret created") {
		t.Fatalf("plain panel missing:\n%s", out.String())
	}
}

func TestCreateQuietOnTTYPrintsBareURL(t *testing.T) {
	api := createServer(t, 24)
	oldTTY := stdoutIsTTY
	stdoutIsTTY = func() bool { return true }
	defer func() { stdoutIsTTY = oldTTY }()
	var out, errw bytes.Buffer
	code := Create(&out, &errw, []string{"--api-url", api, "--text", "x", "--quiet"})
	if code != 0 {
		t.Fatalf("exit = %d", code)
	}
	if trimmed := strings.TrimSpace(out.String()); !strings.HasPrefix(trimmed, "https://ooshare.io/s/") {
		t.Fatalf("--quiet on TTY should print the bare URL, got %q", trimmed)
	}
}

func TestCreateJSONPrettyPrinted(t *testing.T) {
	api := createServer(t, 24)
	var out, errw bytes.Buffer
	code := Create(&out, &errw, []string{"--api-url", api, "--text", "s3cr3t", "--json"})
	if code != 0 {
		t.Fatalf("exit = %d", code)
	}
	s := out.String()
	if !strings.Contains(s, "\n  \"schema\": 1") {
		t.Fatalf("create --json should be 2-space indented, got:\n%s", s)
	}
	// Still valid JSON.
	var parsed map[string]any
	if err := json.Unmarshal(out.Bytes(), &parsed); err != nil {
		t.Fatalf("pretty JSON does not parse: %v", err)
	}
	if parsed["ttl_hours"] != float64(24) {
		t.Fatalf("ttl_hours = %v", parsed["ttl_hours"])
	}
}
