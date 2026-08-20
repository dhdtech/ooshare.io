package cli

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
	"net/http/httptest"
	"os"
	"strings"
	"testing"
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

func TestCreateHumanPrintsURLToStdoutOnly(t *testing.T) {
	api := createServer(t, 24)
	var out, errw bytes.Buffer
	code := Create(&out, &errw, []string{"--api-url", api, "--text", "s3cr3t"})
	if code != 0 {
		t.Fatalf("exit = %d", code)
	}
	trimmed := strings.TrimSpace(out.String())
	if !strings.HasPrefix(trimmed, "https://ooshare.io/s/Kx7mP2nQ?lng=en#") {
		t.Fatalf("stdout = %q", trimmed)
	}
	if strings.Contains(trimmed, "\n") {
		t.Fatalf("stdout should be a single URL line, got %q", trimmed)
	}
	if !strings.Contains(errw.String(), "Secret created") {
		t.Fatalf("decoration missing from stderr: %q", errw.String())
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
