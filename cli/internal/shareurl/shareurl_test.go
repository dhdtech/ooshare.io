package shareurl

import (
	"strings"
	"testing"
)

const keyB64url = "AAECAwQFBgcICQoLDA0ODxAREhMUFRYXGBkaGxwdHh8"

func TestBuildWithAlias(t *testing.T) {
	got := Build("https://ooshare.io", "Kx7mP2nQ", "en", keyB64url)
	want := "https://ooshare.io/s/Kx7mP2nQ?lng=en#" + keyB64url
	if got != want {
		t.Fatalf("Build = %q, want %q", got, want)
	}
}

func TestBuildStripsTrailingSlashAndDefaultsLang(t *testing.T) {
	got := Build("https://ooshare.io/", "Kx7mP2nQ", "", keyB64url)
	if strings.Contains(got, "//s/") || !strings.Contains(got, "?lng=en") {
		t.Fatalf("Build = %q", got)
	}
}

func TestParseRoundTrip(t *testing.T) {
	raw := "https://ooshare.io/s/10000000-1000-4000-8000-100000000000?lng=es#" + keyB64url
	u, err := Parse(raw)
	if err != nil {
		t.Fatal(err)
	}
	if u.ID != "10000000-1000-4000-8000-100000000000" || u.Lang != "es" {
		t.Fatalf("parsed = %+v", u)
	}
	if len(u.Key) != 32 {
		t.Fatalf("key length = %d", len(u.Key))
	}
}

func TestParseMissingKeyFails(t *testing.T) {
	if _, err := Parse("https://ooshare.io/s/Kx7mP2nQ"); err == nil {
		t.Fatal("expected missing-key error")
	}
}

func TestParseInvalidKeyFails(t *testing.T) {
	if _, err := Parse("https://ooshare.io/s/Kx7mP2nQ#!!!!"); err == nil {
		t.Fatal("expected invalid-key error")
	}
}

func TestParseMissingIDFails(t *testing.T) {
	if _, err := Parse("https://ooshare.io/"); err == nil {
		t.Fatal("expected missing-id error")
	}
}

func TestParseShellEscapedURL(t *testing.T) {
	// A URL pasted with backslash-escaped shell metacharacters must parse cleanly.
	raw := "https://ooshare.io/s/TUl9U2JF\\?lng\\=en\\#" + keyB64url
	u, err := Parse(raw)
	if err != nil {
		t.Fatalf("Parse escaped URL: %v", err)
	}
	if u.ID != "TUl9U2JF" {
		t.Fatalf("id = %q, want TUl9U2JF", u.ID)
	}
	if u.Lang != "en" {
		t.Fatalf("lang = %q", u.Lang)
	}
	if len(u.Key) != 32 {
		t.Fatalf("key length = %d", len(u.Key))
	}
}

func TestParseInvalidURLErrors(t *testing.T) {
	// A malformed URL triggers url.Parse to fail.
	if _, err := Parse("https://%zz"); err == nil {
		t.Fatal("expected url parse error")
	}
}

func TestParseWrongKeyLengthFails(t *testing.T) {
	// A valid base64url string that decodes to something other than 32 bytes.
	if _, err := Parse("https://ooshare.io/s/Kx7mP2nQ?lng=en#AAAAAA"); err == nil {
		t.Fatal("expected wrong-key-length error")
	}
}
