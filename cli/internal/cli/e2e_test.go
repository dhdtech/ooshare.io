package cli

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

	"github.com/dhdtech/only-once-share/cli/internal/crypto"
)

// e2eServer is a fake API that stores one secret in memory and serves it once,
// mirroring the real Flask GETDEL behavior for a single secret.
type e2eServer struct {
	ct  string
	id  string
	got bool
}

func (s *e2eServer) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	switch {
	case r.Method == http.MethodPost && r.URL.Path == "/api/secrets":
		var body map[string]any
		json.NewDecoder(r.Body).Decode(&body)
		s.ct = body["ciphertext"].(string)
		s.id = body["id"].(string)
		w.WriteHeader(http.StatusCreated)
		fmt.Fprintf(w, `{"id":%q,"alias":"Kx7mP2nQ"}`, s.id)
	case r.Method == http.MethodGet && strings.HasPrefix(r.URL.Path, "/api/secrets/"):
		if s.got {
			w.WriteHeader(http.StatusNotFound)
			fmt.Fprint(w, `{"error":"Secret not found or already viewed"}`)
			return
		}
		s.got = true
		fmt.Fprintf(w, `{"ciphertext":%q,"id":%q}`, s.ct, s.id)
	default:
		w.WriteHeader(http.StatusNotFound)
	}
}

func TestCreateThenViewRoundTrip(t *testing.T) {
	srv := &e2eServer{}
	hs := httptest.NewServer(srv)
	defer hs.Close()

	var out1, errw1 bytes.Buffer
	old := stdin
	defer func() { stdin = old }()

	if code := Create(&out1, &errw1, []string{"--api-url", hs.URL, "--text", "round trip me", "--ttl", "1", "--json"}); code != 0 {
		t.Fatalf("create exit = %d, stderr = %q", code, errw1.String())
	}
	var created struct {
		URL string `json:"url"`
	}
	json.Unmarshal(out1.Bytes(), &created)
	if created.URL == "" {
		t.Fatalf("no url: %q", out1.String())
	}

	var out2, errw2 bytes.Buffer
	if code := View(&out2, &errw2, []string{"--api-url", hs.URL, created.URL}); code != 0 {
		t.Fatalf("view exit = %d, stderr = %q", code, errw2.String())
	}
	if strings.TrimSpace(out2.String()) != "round trip me" {
		t.Fatalf("view stdout = %q", out2.String())
	}

	// Second view must 404 (one-time read).
	var out3, errw3 bytes.Buffer
	if code := View(&out3, &errw3, []string{"--api-url", hs.URL, created.URL}); code != 1 {
		t.Fatalf("second view exit = %d, want 1", code)
	}
}

func TestViewStreamsAttachmentToStdout(t *testing.T) {
	// Build a secret with a file attachment.
	key := bytes.Repeat([]byte{0x5a}, 32)
	id := "10000000-1000-4000-8000-100000000000"
	payload, err := crypto.EncodePayload("caption", &crypto.ImageAttachment{MIME: "image/png", Data: []byte{0x89, 0x50}})
	if err != nil {
		t.Fatal(err)
	}
	ct, err := crypto.Encrypt(payload, key, id)
	if err != nil {
		t.Fatal(err)
	}
	srv := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprintf(w, `{"ciphertext":%q,"id":%q}`, ct, id)
	}))
	defer srv.Close()
	u := "https://ooshare.io/s/" + id + "?lng=en#" + crypto.Base64urlEncode(key)

	var out, errw bytes.Buffer
	if code := View(&out, &errw, []string{"--api-url", srv.URL, "--output", "-", u}); code != 0 {
		t.Fatalf("exit = %d, stderr = %q", code, errw.String())
	}
	if !bytes.Equal(out.Bytes(), []byte{0x89, 0x50}) {
		t.Fatalf("stdout bytes = %v", out.Bytes())
	}
	if !strings.Contains(errw.String(), "caption") {
		t.Fatalf("text should be on stderr in --output - mode: %q", errw.String())
	}
}

func TestQuietSuppressesStderr(t *testing.T) {
	srv := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusCreated)
		fmt.Fprint(w, `{"id":"x","alias":"Kx7mP2nQ"}`)
	}))
	defer srv.Close()
	var out, errw bytes.Buffer
	if code := Create(&out, &errw, []string{"--api-url", srv.URL, "--text", "x", "--quiet"}); code != 0 {
		t.Fatalf("exit = %d", code)
	}
	if errw.Len() != 0 {
		t.Fatalf("stderr not quiet: %q", errw.String())
	}
}

func TestViewReadsURLFromStdin(t *testing.T) {
	ct, u, _ := makeSecret(t, "stdin url")
	srv := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprintf(w, `{"ciphertext":%q,"id":"10000000-1000-4000-8000-100000000000"}`, ct)
	}))
	defer srv.Close()
	old := stdin
	defer func() { stdin = old }()
	stdin = strings.NewReader(u)
	var out, errw bytes.Buffer
	if code := View(&out, &errw, []string{"--api-url", srv.URL}); code != 0 {
		t.Fatalf("exit = %d, stderr = %q", code, errw.String())
	}
	if strings.TrimSpace(out.String()) != "stdin url" {
		t.Fatalf("stdout = %q", out.String())
	}
}
