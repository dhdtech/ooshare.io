package cli

import (
	"bytes"
	"strings"
	"testing"
)

func TestRunVersion(t *testing.T) {
	var out, errw bytes.Buffer
	if code := Run([]string{"version"}, &out, &errw); code != 0 {
		t.Fatalf("exit = %d, stderr = %q", code, errw.String())
	}
	if !strings.HasPrefix(out.String(), "ooshare ") {
		t.Fatalf("version output = %q", out.String())
	}
}

func TestRunUnknownCommandExits2(t *testing.T) {
	var out, errw bytes.Buffer
	if code := Run([]string{"frobnicate"}, &out, &errw); code != 2 {
		t.Fatalf("exit = %d, want 2", code)
	}
}

func TestRunNoArgsExits2(t *testing.T) {
	var out, errw bytes.Buffer
	if code := Run(nil, &out, &errw); code != 2 {
		t.Fatalf("exit = %d, want 2", code)
	}
}

func TestRunHelpExits0(t *testing.T) {
	var out, errw bytes.Buffer
	if code := Run([]string{"--help"}, &out, &errw); code != 0 {
		t.Fatalf("exit = %d, want 0", code)
	}
	if !strings.Contains(out.String(), "create") {
		t.Fatalf("help output = %q", out.String())
	}
}

func TestRunDispatchesCreateAndView(t *testing.T) {
	// Create via Run straight into an error path so no server is needed.
	var out, errw bytes.Buffer
	if code := Run([]string{"create", "--text", "x", "--ttl", "99"}, &out, &errw); code != 2 {
		t.Fatalf("create exit = %d, want 2", code)
	}
	out.Reset()
	errw.Reset()
	if code := Run([]string{"view"}, &out, &errw); code != 2 {
		t.Fatalf("view exit = %d, want 2", code)
	}
}
