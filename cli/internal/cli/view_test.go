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

	"github.com/dhdtech/only-once-share/cli/internal/crypto"
)

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

func TestViewMalformedURLExits2(t *testing.T) {
	var out, errw bytes.Buffer
	if code := View(&out, &errw, []string{"not-a-url"}); code != 2 {
		t.Fatalf("exit = %d, want 2", code)
	}
}
