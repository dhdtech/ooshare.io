// style.go — rich human output for ooshare commands. All lipgloss usage is
// isolated in this file so callers stay styling-agnostic.
package cli

import (
	"fmt"
	"os"
	"strings"

	"github.com/charmbracelet/lipgloss"
	"github.com/muesli/termenv"
)

// colorRenderer forces TrueColor so the rich branch always emits ANSI codes even
// when stdout is not a TTY (e.g. under go test or a redirected pipe). Callers opt
// into color explicitly via noColor=false, so we make that opt-in deterministic.
var colorRenderer = lipgloss.NewRenderer(
	os.Stdout,
	termenv.WithProfile(termenv.TrueColor),
	termenv.WithTTY(true),
)

// stdoutIsTTY reports whether stdout is an interactive terminal. Overridable in tests.
// os.Stdout is already a *os.File, so it is passed directly to isTerminal.
var stdoutIsTTY = func() bool {
	return isTerminal(os.Stdout)
}

// isTerminal reports whether f is a character device (i.e. a terminal, not a pipe/file).
func isTerminal(f *os.File) bool {
	info, err := f.Stat()
	return err == nil && (info.Mode()&os.ModeCharDevice) != 0
}

// noColorEnv reports the NO_COLOR convention: NO_COLOR present (even empty) or TERM=dumb.
func noColorEnv() bool {
	if _, set := os.LookupEnv("NO_COLOR"); set {
		return true
	}
	return os.Getenv("TERM") == "dumb"
}

// attachmentInfo is the rendered attachment row data.
type attachmentInfo struct {
	Name string // basename of the attached file
	Size string // pre-formatted size, e.g. "1.2 MB"
}

// createSuccessData is everything renderCreateSuccess needs.
type createSuccessData struct {
	TTLHours   int
	URL        string
	Attachment *attachmentInfo // nil when none
}

// renderCreateSuccess renders the rich "secret created" panel.
// When noColor is true the output is the same content as plain lines with no
// ANSI codes and no box-drawing characters (safest for TERM=dumb / NO_COLOR).
func renderCreateSuccess(d createSuccessData, noColor bool) string {
	linkHeader := "🔑  Your secret link — open it ONCE:"
	hint := "Share it over a private channel. Anyone with this link can read the secret."
	body := fmt.Sprintf("After it's viewed — or after %dh — the secret is destroyed forever.", d.TTLHours)

	if noColor {
		var b strings.Builder
		fmt.Fprintln(&b, "✓  Secret created — opens exactly once")
		fmt.Fprintln(&b)
		fmt.Fprintln(&b, body)
		if d.Attachment != nil {
			fmt.Fprintln(&b)
			fmt.Fprintf(&b, "📎  %s · %s\n", d.Attachment.Name, d.Attachment.Size)
		}
		fmt.Fprintln(&b)
		fmt.Fprintln(&b, linkHeader)
		fmt.Fprintln(&b)
		fmt.Fprintln(&b, d.URL)
		fmt.Fprintln(&b)
		fmt.Fprintln(&b, hint)
		return b.String()
	}

	green := colorRenderer.NewStyle().
		Bold(true).
		Foreground(lipgloss.AdaptiveColor{Light: "#1a7f37", Dark: "#7ee787"})
	dimmer := colorRenderer.NewStyle().
		Foreground(lipgloss.AdaptiveColor{Light: "#57606a", Dark: "#8b949e"})
	linkStyle := colorRenderer.NewStyle().
		Bold(true).
		Foreground(lipgloss.AdaptiveColor{Light: "#0969da", Dark: "#79c0ff"})
	border := colorRenderer.NewStyle().
		Border(lipgloss.RoundedBorder()).
		Padding(0, 2).
		BorderForeground(lipgloss.AdaptiveColor{Light: "#d0d7de", Dark: "#30363d"})

	var boxLines []string
	boxLines = append(boxLines, green.Render("✓  Secret created — opens exactly once"))
	boxLines = append(boxLines, "")
	boxLines = append(boxLines, dimmer.Render(body))
	if d.Attachment != nil {
		boxLines = append(boxLines, "", dimmer.Render(fmt.Sprintf("📎  %s · %s", d.Attachment.Name, d.Attachment.Size)))
	}
	box := border.Render(strings.Join(boxLines, "\n"))

	// Link below the box, full URL (not truncated), styled bold + blue.
	return box + "\n\n" + linkHeader + "\n\n" + linkStyle.Render(d.URL) + "\n\n" + hint + "\n"
}
