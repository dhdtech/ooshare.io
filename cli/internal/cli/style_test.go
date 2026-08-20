package cli

import (
	"os"
	"regexp"
	"strings"
	"testing"
)

var ansiRE = regexp.MustCompile(`\x1b\[[0-9;]*m`)

func stripANSI(s string) string { return ansiRE.ReplaceAllString(s, "") }

func TestRenderCreateSuccessPlain(t *testing.T) {
	got := renderCreateSuccess(createSuccessData{
		TTLHours: 1,
		URL:      "https://example.com/s/ABC#KEY",
	}, true)
	want := "✓  Secret created — opens exactly once\n" +
		"\n" +
		"After it's viewed — or after 1h — the secret is destroyed forever.\n" +
		"\n" +
		"🔑  Your secret link — open it ONCE:\n" +
		"\n" +
		"https://example.com/s/ABC#KEY\n" +
		"\n" +
		"Share it over a private channel. Anyone with this link can read the secret.\n"
	if got != want {
		t.Fatalf("plain render mismatch:\n--- got ---\n%s\n--- want ---\n%s", got, want)
	}
}

func TestRenderCreateSuccessPlainWithAttachment(t *testing.T) {
	got := renderCreateSuccess(createSuccessData{
		TTLHours:   72,
		URL:        "U",
		Attachment: &attachmentInfo{Name: "contract.pdf", Size: "1.2 MB"},
	}, true)
	for _, want := range []string{"after 72h", "📎  contract.pdf · 1.2 MB"} {
		if !strings.Contains(got, want) {
			t.Fatalf("plain render missing %q:\n%s", want, got)
		}
	}
}

func TestRenderCreateSuccessColorHasANSIMatchingPlain(t *testing.T) {
	got := renderCreateSuccess(createSuccessData{
		TTLHours: 1,
		URL:      "https://example.com/s/ABC#KEY",
	}, false)
	if !strings.Contains(got, "\x1b[") {
		t.Fatalf("expected ANSI codes, got %q", got)
	}
	plain := stripANSI(got)
	if !strings.Contains(plain, "Secret created — opens exactly once") ||
		!strings.Contains(plain, "https://example.com/s/ABC#KEY") ||
		!strings.Contains(plain, "after 1h") {
		t.Fatalf("ANSI-stripped output lost content:\n%q", plain)
	}
}

func TestNoColorEnv(t *testing.T) {
	t.Run("unset", func(t *testing.T) {
		// t.Setenv("", ...) would leave the var present-but-empty (which the
		// no-color spec treats as "set"), so to represent a truly unset var we
		// must remove it. Sibling subtests each set NO_COLOR explicitly, so no
		// restoration is needed here.
		os.Unsetenv("NO_COLOR")
		if noColorEnv() {
			t.Fatal("noColorEnv should be false when NO_COLOR is unset")
		}
	})
	t.Run("set empty", func(t *testing.T) {
		t.Setenv("NO_COLOR", "")
		if !noColorEnv() {
			t.Fatal("NO_COLOR present-but-empty should still enable noColor")
		}
	})
	t.Run("set", func(t *testing.T) {
		t.Setenv("NO_COLOR", "1")
		if !noColorEnv() {
			t.Fatal("noColorEnv should be true when NO_COLOR=1")
		}
	})
	t.Run("dumb term", func(t *testing.T) {
		t.Setenv("NO_COLOR", "")
		t.Setenv("TERM", "dumb")
		if !noColorEnv() {
			t.Fatal("noColorEnv should be true when TERM=dumb")
		}
	})
}

func TestIsTerminalPipe(t *testing.T) {
	// A pipe is not a terminal.
	r, w, err := os.Pipe()
	if err != nil {
		t.Fatal(err)
	}
	defer r.Close()
	defer w.Close()
	if isTerminal(w) {
		t.Fatal("a pipe should not be a terminal")
	}
}

func TestStdoutIsTTYExecutes(t *testing.T) {
	_ = stdoutIsTTY() // exercises the default closure over os.Stdout
}
