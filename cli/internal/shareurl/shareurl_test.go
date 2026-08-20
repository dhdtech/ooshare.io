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
