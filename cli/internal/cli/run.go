// Package cli implements the ooshare command surface.
package cli

import (
	"fmt"
	"io"
	"os"
)

// Version is stamped at release build time via -ldflags "-X …/internal/cli.Version=…".
var Version = "dev"

// stdin is the text/URL input source; overridable in tests.
var stdin io.Reader = os.Stdin

func Run(args []string, out, errw io.Writer) int {
	if len(args) == 0 {
		usage(errw)
		return 2
	}
	switch args[0] {
	case "create":
		return Create(out, errw, args[1:])
	case "view":
		return View(out, errw, args[1:])
	case "version":
		fmt.Fprintf(out, "ooshare %s\n", Version)
		return 0
	case "help", "-h", "--help":
		usage(out)
		return 0
	default:
		fmt.Fprintf(errw, "ooshare: unknown command %q\n\n", args[0])
		usage(errw)
		return 2
	}
}

func usage(w io.Writer) {
	fmt.Fprintln(w, `ooshare — only-once secret sharing CLI

Usage:
  ooshare create [flags]   Create a one-time secret and print its URL
  ooshare view <url>       Reveal a secret from its URL
  ooshare version          Print version info

Run 'ooshare create --help' or 'ooshare view --help' for command flags.`)
}
