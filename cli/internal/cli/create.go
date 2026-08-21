package cli

import (
	"context"
	"crypto/rand"
	"encoding/json"
	"errors"
	"flag"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"os"
	"path/filepath"
	"strings"
	"time"
	"unicode/utf8"

	"github.com/dhdtech/ooshare.io/cli/internal/api"
	"github.com/dhdtech/ooshare.io/cli/internal/crypto"
	"github.com/dhdtech/ooshare.io/cli/internal/shareurl"
)

const (
	defaultAPIURL = "https://api.ooshare.io"
	defaultOrigin = "https://ooshare.io"
	defaultLang   = "en"
	maxFileSize   = 25 * 1024 * 1024
	maxTextChars  = 50000
)

var validLangs = map[string]bool{
	"en": true, "zh": true, "es": true, "hi": true, "ar": true, "pt": true,
}

var extMIME = map[string]string{
	".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png",
	".gif": "image/gif", ".webp": "image/webp", ".pdf": "application/pdf",
	".zip": "application/zip", ".rar": "application/vnd.rar",
	".7z": "application/x-7z-compressed",
	".gz": "application/gzip", ".tgz": "application/gzip",
	".tar": "application/x-tar",
}

// Create mirrors the web's create flow (CreateSecret.tsx) and prints the share URL.
func Create(out, errw io.Writer, args []string) int {
	fs := flag.NewFlagSet("create", flag.ContinueOnError)
	fs.SetOutput(errw)
	text := fs.String("text", "", "secret text (alternative: pipe it to stdin)")
	filePath := fs.String("file", "", "optional file attachment (max 25 MB)")
	ttl := fs.Int("ttl", 24, "expiry in hours (1-72)")
	lang := fs.String("lang", defaultLang, "viewer language code (en, zh, es, hi, ar, pt)")
	apiURL := fs.String("api-url", defaultAPIURL, "API base URL (env OOSHARE_API_URL)")
	origin := fs.String("origin", defaultOrigin, "site origin for the share URL (env OOSHARE_ORIGIN)")
	asJSON := fs.Bool("json", false, "emit machine-readable JSON on stdout")
	quiet := fs.Bool("quiet", false, "suppress stderr decoration")
	if err := fs.Parse(reorderArgs(fs, args)); err != nil {
		return 2
	}
	if fs.NArg() > 0 {
		fmt.Fprintf(errw, "ooshare create: unexpected argument %q\n", fs.Arg(0))
		return 2
	}

	apiURLStr := envDefault(*apiURL, "OOSHARE_API_URL", defaultAPIURL)
	originStr := envDefault(*origin, "OOSHARE_ORIGIN", defaultOrigin)
	if !*quiet {
		warnInsecure(errw, apiURLStr)
	}

	if *ttl < 1 || *ttl > 72 {
		fmt.Fprintf(errw, "ooshare create: --ttl must be between 1 and 72, got %d\n", *ttl)
		return 2
	}
	if !validLangs[*lang] {
		fmt.Fprintf(errw, "ooshare create: invalid --lang %q (valid: en, zh, es, hi, ar, pt)\n", *lang)
		return 2
	}

	secretText, err := readText(*text, *filePath)
	if err != nil {
		fmt.Fprintln(errw, err)
		return 2
	}
	if utf8.RuneCountInString(secretText) > maxTextChars {
		fmt.Fprintf(errw, "ooshare create: text exceeds %d characters\n", maxTextChars)
		return 2
	}

	var attachment *crypto.ImageAttachment
	if *filePath != "" {
		att, err := readAttachment(*filePath, errw)
		if err != nil {
			fmt.Fprintln(errw, err)
			return 1
		}
		attachment = att
	}

	id, err := newUUID()
	if err != nil {
		fmt.Fprintf(errw, "ooshare create: %v\n", err)
		return 1
	}
	key, err := crypto.GenerateKey()
	if err != nil {
		fmt.Fprintf(errw, "ooshare create: %v\n", err)
		return 1
	}
	defer crypto.Zeroize(key)

	payload, err := crypto.EncodePayload(secretText, attachment)
	if err != nil {
		fmt.Fprintf(errw, "ooshare create: %v\n", err)
		return 1
	}
	defer crypto.Zeroize(payload)

	ciphertext, err := crypto.Encrypt(payload, key, id)
	if err != nil {
		fmt.Fprintf(errw, "ooshare create: %v\n", err)
		return 1
	}

	client := &api.Client{BaseURL: apiURLStr, HTTP: &http.Client{Timeout: 30 * time.Second}}
	res, err := client.CreateSecret(context.Background(), ciphertext, *ttl, id)
	if err != nil {
		fmt.Fprintf(errw, "ooshare create: %v\n", err)
		return 1
	}

	pathID := res.ID
	if res.Alias != "" {
		pathID = res.Alias
	}
	shareURL := shareurl.Build(originStr, pathID, *lang, crypto.Base64urlEncode(key))

	if *asJSON {
		enc := json.NewEncoder(out)
		enc.SetIndent("", "  ")
		enc.Encode(map[string]any{
			"schema":         1,
			"id":             res.ID,
			"alias":          res.Alias,
			"url":            shareURL,
			"ttl_hours":      *ttl,
			"has_attachment": attachment != nil,
		})
		return 0
	}

	if !*quiet && stdoutIsTTY() {
		var att *attachmentInfo
		if attachment != nil {
			att = &attachmentInfo{
				Name: filepath.Base(*filePath),
				Size: formatBytes(int64(len(attachment.Data))),
			}
		}
		fmt.Fprint(out, renderCreateSuccess(createSuccessData{
			TTLHours:   *ttl,
			URL:        shareURL,
			Attachment: att,
		}, noColorEnv()))
		return 0
	}
	fmt.Fprintln(out, shareURL)
	return 0
}

// readText resolves the secret text from --text or stdin (when piped).
func readText(flagText, filePath string) (string, error) {
	if flagText != "" {
		return flagText, nil
	}
	if stdinIsTTY() {
		if filePath != "" {
			return "", nil // file-only secret
		}
		return "", errors.New("ooshare create: no secret text or --file provided")
	}
	b, err := io.ReadAll(io.LimitReader(stdin, 4*maxTextChars))
	if err != nil {
		return "", fmt.Errorf("ooshare create: reading stdin: %w", err)
	}
	return string(b), nil
}

// stdinIsTTY reports whether stdin is an interactive terminal (i.e. NOT piped).
// An injected io.Reader (tests, CI pipes) is never a TTY.
func stdinIsTTY() bool {
	f, ok := stdin.(*os.File)
	if !ok {
		return false
	}
	info, err := f.Stat()
	return err == nil && (info.Mode()&os.ModeCharDevice) != 0
}

func readAttachment(path string, errw io.Writer) (*crypto.ImageAttachment, error) {
	info, err := os.Stat(path)
	if err != nil {
		return nil, fmt.Errorf("ooshare create: %v", err)
	}
	if info.Size() > maxFileSize {
		return nil, fmt.Errorf("ooshare create: file exceeds 25 MB (%s)", formatBytes(info.Size()))
	}
	mime, err := detectMIME(path)
	if err != nil {
		return nil, fmt.Errorf("ooshare create: %v", err)
	}
	data, err := os.ReadFile(path)
	if err != nil {
		return nil, fmt.Errorf("ooshare create: %v", err)
	}
	return &crypto.ImageAttachment{MIME: mime, Data: data}, nil
}

// detectMIME maps a file extension to an allowed MIME type (mirrors FileDropzone.ACCEPTED_TYPES).
func detectMIME(path string) (string, error) {
	lower := strings.ToLower(path)
	if strings.HasSuffix(lower, ".tar.gz") || strings.HasSuffix(lower, ".tgz") {
		return "application/gzip", nil
	}
	ext := strings.ToLower(filepath.Ext(path))
	m, ok := extMIME[ext]
	if !ok {
		return "", fmt.Errorf("unsupported file type %q (allowed: images, PDF, ZIP, RAR, 7Z, TAR.GZ)", ext)
	}
	return m, nil
}

// newUUID returns a random RFC 4122 version-4 UUID (mirrors the web's uuid v4).
func newUUID() (string, error) {
	b := make([]byte, 16)
	if _, err := rand.Read(b); err != nil {
		return "", err
	}
	b[6] = (b[6] & 0x0f) | 0x40
	b[8] = (b[8] & 0x3f) | 0x80
	return fmt.Sprintf("%x-%x-%x-%x-%x", b[0:4], b[4:6], b[6:8], b[8:10], b[10:16]), nil
}

// envDefault: an explicitly-set flag beats the environment; env beats the default.
func envDefault(flagValue, envName, def string) string {
	if flagValue != def {
		return flagValue
	}
	if v := os.Getenv(envName); v != "" {
		return v
	}
	return def
}

// warnInsecure warns when the API is plain http outside localhost.
func warnInsecure(errw io.Writer, rawURL string) {
	u, err := url.Parse(rawURL)
	if err != nil {
		return
	}
	if u.Scheme == "http" && !isLocalhost(u.Hostname()) {
		fmt.Fprintf(errw, "ooshare: warning: --api-url uses http (non-localhost) — ciphertext is sent insecurely\n")
	}
}

func isLocalhost(host string) bool {
	return host == "localhost" || host == "127.0.0.1" || host == "::1"
}

func formatBytes(n int64) string {
	switch {
	case n < 1024:
		return fmt.Sprintf("%d B", n)
	case n < 1024*1024:
		return fmt.Sprintf("%.1f KB", float64(n)/1024)
	default:
		return fmt.Sprintf("%.1f MB", float64(n)/(1024*1024))
	}
}
