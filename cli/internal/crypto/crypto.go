// Package crypto is a byte-for-byte Go port of ui/src/lib/crypto.ts.
//
//	Cipher:  AES-256-GCM (authenticated encryption)
//	KDF:     HKDF-SHA-256 (per-secret key from master key + secret ID)
//	IV:      96-bit random per encryption
//	AAD:     secret ID bound as additional authenticated data
//	Format:  base64( [version 1B] [iv 12B] [ciphertext + GCM tag] )
package crypto

import (
	"encoding/base64"
	"encoding/binary"
	"errors"
	"fmt"
)

const (
	version = 0x01
	ivBytes = 12

	payloadText      = 0x00
	payloadTextImage = 0x01

	// hkdfSalt matches the salt constant in ui/src/lib/crypto.ts.
	hkdfSalt = "only-once-share-v1"
)

// ImageAttachment is a file attachment stored inside a secret envelope.
type ImageAttachment struct {
	MIME string
	Data []byte
}

// DecodedPayload is the plaintext contents of an envelope.
type DecodedPayload struct {
	Text  string
	Image *ImageAttachment
}

// EncodePayload packs text plus an optional attachment into the binary envelope:
//
//	text-only:  [0x00][text UTF-8]
//	text+file:  [0x01][text_len u32 BE][text][mime_len u8][mime][file bytes]
func EncodePayload(text string, img *ImageAttachment) ([]byte, error) {
	if img == nil {
		out := make([]byte, 1+len(text))
		out[0] = payloadText
		copy(out[1:], text)
		return out, nil
	}
	if len(img.MIME) > 255 {
		return nil, fmt.Errorf("MIME type too long (max 255 bytes)")
	}
	total := 1 + 4 + len(text) + 1 + len(img.MIME) + len(img.Data)
	out := make([]byte, total)
	out[0] = payloadTextImage
	binary.BigEndian.PutUint32(out[1:5], uint32(len(text)))
	copy(out[5:], text)
	off := 5 + len(text)
	out[off] = byte(len(img.MIME))
	off++
	copy(out[off:], img.MIME)
	off += len(img.MIME)
	copy(out[off:], img.Data)
	return out, nil
}

// DecodePayload unpacks an envelope after decryption.
// 0x00 -> text-only; 0x01 -> text+file; anything else -> legacy raw UTF-8 text.
func DecodePayload(p []byte) (DecodedPayload, error) {
	if len(p) == 0 {
		return DecodedPayload{}, nil
	}
	switch p[0] {
	case payloadText:
		return DecodedPayload{Text: string(p[1:])}, nil
	case payloadTextImage:
		// Minimum: [type 1B][text_len 4B][mime_len 1B] = 6 bytes
		if len(p) < 6 {
			return DecodedPayload{}, errors.New("Truncated text+image payload")
		}
		textLen := int(binary.BigEndian.Uint32(p[1:5]))
		if 5+textLen+1 > len(p) {
			return DecodedPayload{}, errors.New("Truncated text+image payload")
		}
		text := string(p[5 : 5+textLen])
		mimeLen := int(p[5+textLen])
		if 6+textLen+mimeLen > len(p) {
			return DecodedPayload{}, errors.New("Truncated text+image payload")
		}
		mime := string(p[6+textLen : 6+textLen+mimeLen])
		data := append([]byte(nil), p[6+textLen+mimeLen:]...)
		return DecodedPayload{Text: text, Image: &ImageAttachment{MIME: mime, Data: data}}, nil
	default:
		// Legacy: no type byte, entire payload is raw UTF-8 text.
		return DecodedPayload{Text: string(p)}, nil
	}
}

// --- base64 helpers (mirror ui/src/lib/crypto.ts) ---

func b64Encode(b []byte) string          { return base64.StdEncoding.EncodeToString(b) }
func b64Decode(s string) ([]byte, error) { return base64.StdEncoding.DecodeString(s) }

// Base64urlEncode encodes bytes for the URL-fragment master key.
func Base64urlEncode(b []byte) string { return base64.RawURLEncoding.EncodeToString(b) }

// Base64urlDecode decodes a URL-fragment master key.
func Base64urlDecode(s string) ([]byte, error) { return base64.RawURLEncoding.DecodeString(s) }
