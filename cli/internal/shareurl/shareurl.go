// Package shareurl builds and parses ooshare share URLs.
//
//	https://ooshare.io/s/<alias|uuid>?lng=en#<base64url master key>
package shareurl

import (
	"errors"
	"fmt"
	"net/url"
	"strings"

	"github.com/dhdtech/only-once-share/cli/internal/crypto"
)

const keyBytes = 32

// ShareURL is a parsed share URL.
type ShareURL struct {
	ID   string // path id: 8-char alias or UUID
	Lang string // ?lng= parameter (empty when absent)
	Key  []byte // master key (decoded from the fragment)
}

// Build constructs the share URL. lang defaults to "en" when empty.
func Build(origin, id, lang, keyB64url string) string {
	origin = strings.TrimRight(origin, "/")
	if lang == "" {
		lang = "en"
	}
	return fmt.Sprintf("%s/s/%s?lng=%s#%s", origin, id, lang, keyB64url)
}

// Parse decodes a full share URL.
func Parse(raw string) (*ShareURL, error) {
	u, err := url.Parse(raw)
	if err != nil {
		return nil, fmt.Errorf("invalid URL: %w", err)
	}
	path := strings.TrimPrefix(u.Path, "/")
	id := strings.TrimPrefix(path, "s/")
	if id == "" || id == path {
		return nil, errors.New("missing secret id in URL path")
	}
	if u.Fragment == "" {
		return nil, errors.New("missing master key in URL fragment")
	}
	key, err := crypto.Base64urlDecode(u.Fragment)
	if err != nil {
		return nil, errors.New("invalid master key in URL fragment")
	}
	if len(key) != keyBytes {
		return nil, fmt.Errorf("invalid master key length %d (want 32)", len(key))
	}
	return &ShareURL{ID: id, Lang: u.Query().Get("lng"), Key: key}, nil
}
