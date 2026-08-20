package cli

import (
	"context"
	"encoding/json"
	"flag"
	"fmt"
	"io"
	"net/http"
	"os"
	"path/filepath"
	"strings"
	"time"

	"github.com/dhdtech/only-once-share/cli/internal/api"
	"github.com/dhdtech/only-once-share/cli/internal/crypto"
	"github.com/dhdtech/only-once-share/cli/internal/shareurl"
)

// View mirrors the web's reveal flow (ViewSecret.tsx) and prints the plaintext.
func View(out, errw io.Writer, args []string) int {
	fs := flag.NewFlagSet("view", flag.ContinueOnError)
	fs.SetOutput(errw)
	output := fs.String("output", "", "attachment destination: '-'=stdout, <dir>/ or <path>")
	asJSON := fs.Bool("json", false, "emit machine-readable JSON on stdout")
	quiet := fs.Bool("quiet", false, "suppress stderr decoration")
	apiURL := fs.String("api-url", defaultAPIURL, "API base URL (env OOSHARE_API_URL)")
	if err := fs.Parse(args); err != nil {
		return 2
	}

	var raw string
	switch fs.NArg() {
	case 1:
		raw = fs.Arg(0)
	case 0:
		if stdinIsTTY() {
			fmt.Fprintln(errw, "ooshare view: no URL provided (pass it as an argument or pipe it via stdin)")
			return 2
		}
		b, err := io.ReadAll(stdin)
		if err != nil {
			fmt.Fprintf(errw, "ooshare view: reading stdin: %v\n", err)
			return 1
		}
		raw = strings.TrimSpace(string(b))
	default:
		fmt.Fprintln(errw, "ooshare view: expected exactly one URL argument")
		return 2
	}
	if raw == "" {
		fmt.Fprintln(errw, "ooshare view: no URL provided")
		return 2
	}

	u, err := shareurl.Parse(raw)
	if err != nil {
		fmt.Fprintf(errw, "ooshare view: %v\n", err)
		return 2
	}
	defer crypto.Zeroize(u.Key)

	apiURLStr := envDefault(*apiURL, "OOSHARE_API_URL", defaultAPIURL)
	if !*quiet {
		warnInsecure(errw, apiURLStr)
	}
	client := &api.Client{BaseURL: apiURLStr, HTTP: &http.Client{Timeout: 30 * time.Second}}

	ciphertext, actualID, err := client.GetSecret(context.Background(), u.ID)
	if err != nil {
		fmt.Fprintf(errw, "ooshare view: %v\n", err)
		return 1
	}
	pt, err := crypto.Decrypt(ciphertext, u.Key, actualID)
	if err != nil {
		fmt.Fprintf(errw, "ooshare view: %v\n", err)
		return 1
	}
	defer crypto.Zeroize(pt)

	decoded, err := crypto.DecodePayload(pt)
	if err != nil {
		fmt.Fprintf(errw, "ooshare view: %v\n", err)
		return 1
	}

	if *asJSON && decoded.Image != nil && *output == "-" {
		fmt.Fprintln(errw, "ooshare view: --json cannot be combined with --output - when a file attachment is present (JSON and raw bytes cannot both go to stdout)")
		return 2
	}

	if decoded.Image != nil && *output == "-" {
		// Raw bytes to stdout; text moves to stderr so stdout stays pure binary.
		if _, err := out.Write(decoded.Image.Data); err != nil {
			fmt.Fprintf(errw, "ooshare view: %v\n", err)
			return 1
		}
		if decoded.Text != "" {
			fmt.Fprintln(errw, decoded.Text)
		}
		return 0
	}

	if *asJSON {
		obj := map[string]any{"schema": 1, "text": decoded.Text}
		if decoded.Image != nil {
			path := ""
			if *output != "-" {
				path, err = writeAttachment(decoded.Image, *output, out)
				if err != nil {
					fmt.Fprintf(errw, "ooshare view: %v\n", err)
					return 1
				}
			}
			obj["attachment"] = map[string]any{
				"path": path,
				"mime": decoded.Image.MIME,
				"size": len(decoded.Image.Data),
			}
		}
		enc := json.NewEncoder(out)
		enc.SetIndent("", "  ")
		enc.Encode(obj)
		return 0
	}

	if decoded.Text != "" {
		fmt.Fprintln(out, decoded.Text)
	}
	if decoded.Image != nil {
		path, err := writeAttachment(decoded.Image, *output, out)
		if err != nil {
			fmt.Fprintf(errw, "ooshare view: %v\n", err)
			return 1
		}
		if !*quiet {
			fmt.Fprintf(errw, "Attachment saved to %s · %s\n", path, formatBytes(int64(len(decoded.Image.Data))))
		}
	}
	return 0
}

// derivedName maps a MIME type to a filename, mirroring the web's download naming.
func derivedName(mime string) string {
	switch mime {
	case "image/jpeg":
		return "secret.jpg"
	case "image/png":
		return "secret.png"
	case "image/gif":
		return "secret.gif"
	case "image/webp":
		return "secret.webp"
	case "application/pdf":
		return "secret.pdf"
	case "application/zip", "application/x-zip-compressed":
		return "secret.zip"
	case "application/vnd.rar", "application/x-rar-compressed":
		return "secret.rar"
	case "application/x-7z-compressed":
		return "secret.7z"
	case "application/gzip":
		return "secret.tar.gz"
	case "application/x-tar":
		return "secret.tar"
	default:
		return "secret.bin"
	}
}

// writeAttachment writes a decoded attachment to disk per the --output rules:
// "-" = stdout; dir/ or existing dir = derived name inside; else exact path.
func writeAttachment(img *crypto.ImageAttachment, output string, out io.Writer) (string, error) {
	if output == "-" {
		if _, err := out.Write(img.Data); err != nil {
			return "", err
		}
		return "", nil
	}
	name := derivedName(img.MIME)
	isDir := strings.HasSuffix(output, string(os.PathSeparator))
	if !isDir {
		if info, err := os.Stat(output); err == nil && info.IsDir() {
			isDir = true
		}
	}
	path := output
	if isDir || output == "" {
		path = filepath.Join(output, name)
	}
	if err := os.MkdirAll(filepath.Dir(path), 0o755); err != nil {
		return "", err
	}
	if err := os.WriteFile(path, img.Data, 0o600); err != nil {
		return "", err
	}
	return path, nil
}
