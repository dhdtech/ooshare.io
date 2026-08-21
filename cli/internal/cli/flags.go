package cli

import (
	"flag"
	"strings"
)

// isBoolFlag reports whether f is a boolean flag (i.e. takes no separate value).
func isBoolFlag(f *flag.Flag) bool {
	_, ok := f.Value.(interface{ IsBoolFlag() bool })
	return ok
}

// reorderArgs moves positional arguments to the end so that flag.Parse works even
// when a positional (e.g. the share URL in `ooshare view "$url" --output dir`)
// appears before flags. Go's flag package stops parsing at the first non-flag
// argument, which made `view "$url" --output …` fail.
func reorderArgs(fs *flag.FlagSet, args []string) []string {
	var flagArgs, posArgs []string
	for i := 0; i < len(args); i++ {
		a := args[i]
		if a == "--" {
			posArgs = append(posArgs, args[i+1:]...)
			break
		}
		if len(a) > 1 && a[0] == '-' {
			flagArgs = append(flagArgs, a)
			if !strings.Contains(a, "=") {
				name := strings.TrimLeft(a, "-")
				if f := fs.Lookup(name); f != nil && !isBoolFlag(f) {
					// space-separated value flag: consume the next argument
					i++
					if i < len(args) {
						flagArgs = append(flagArgs, args[i])
					}
				}
			}
		} else {
			posArgs = append(posArgs, a)
		}
	}
	return append(flagArgs, posArgs...)
}
