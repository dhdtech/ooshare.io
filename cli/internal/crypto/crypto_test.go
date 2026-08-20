package crypto

import (
	"bytes"
	"strings"
	"testing"
)

func TestEncodeDecodeTextOnly(t *testing.T) {
	p, err := EncodePayload("Hello, World!", nil)
	if err != nil {
		t.Fatal(err)
	}
	if p[0] != payloadText {
		t.Fatalf("type byte = %#x, want 0x00", p[0])
	}
	if len(p) != 1+len("Hello, World!") {
		t.Fatalf("length = %d", len(p))
	}
	d, err := DecodePayload(p)
	if err != nil {
		t.Fatal(err)
	}
	if d.Text != "Hello, World!" || d.Image != nil {
		t.Fatalf("decoded = %+v", d)
	}
}

func TestEncodeDecodeTextImage(t *testing.T) {
	img := &ImageAttachment{MIME: "image/png", Data: []byte{0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a}}
	p, err := EncodePayload("Caption text", img)
	if err != nil {
		t.Fatal(err)
	}
	if p[0] != payloadTextImage {
		t.Fatalf("type byte = %#x, want 0x01", p[0])
	}
	// [type 1][text_len 4][text 12][mime_len 1][mime 9][image 6] = 33
	if len(p) != 1+4+12+1+9+6 {
		t.Fatalf("length = %d", len(p))
	}
	d, err := DecodePayload(p)
	if err != nil {
		t.Fatal(err)
	}
	if d.Text != "Caption text" || d.Image == nil {
		t.Fatalf("decoded = %+v", d)
	}
	if d.Image.MIME != "image/png" || !bytes.Equal(d.Image.Data, img.Data) {
		t.Fatalf("image = %+v", d.Image)
	}
}

func TestEncodeDecodeEmptyText(t *testing.T) {
	p, err := EncodePayload("", nil)
	if err != nil {
		t.Fatal(err)
	}
	if p[0] != payloadText || len(p) != 1 {
		t.Fatalf("payload = %x", p)
	}
	d, err := DecodePayload(p)
	if err != nil {
		t.Fatal(err)
	}
	if d.Text != "" || d.Image != nil {
		t.Fatalf("decoded = %+v", d)
	}
}

func TestDecodeLegacyRawText(t *testing.T) {
	d, err := DecodePayload([]byte("legacy secret"))
	if err != nil {
		t.Fatal(err)
	}
	if d.Text != "legacy secret" || d.Image != nil {
		t.Fatalf("decoded = %+v", d)
	}
}

func TestDecodeEmptyPayload(t *testing.T) {
	d, err := DecodePayload(nil)
	if err != nil {
		t.Fatal(err)
	}
	if d.Text != "" || d.Image != nil {
		t.Fatalf("decoded = %+v", d)
	}
}

func TestUnicodeRoundTrip(t *testing.T) {
	for _, text := range []string{"日本語テスト 🎉", "héllo", "a\nb\tc"} {
		p, err := EncodePayload(text, nil)
		if err != nil {
			t.Fatal(err)
		}
		d, err := DecodePayload(p)
		if err != nil {
			t.Fatal(err)
		}
		if d.Text != text {
			t.Fatalf("round trip %q -> %q", text, d.Text)
		}
	}
}

func TestEncodeMIMETooLong(t *testing.T) {
	longMIME := strings.Repeat("x", 256)
	if _, err := EncodePayload("t", &ImageAttachment{MIME: longMIME, Data: []byte{1}}); err == nil {
		t.Fatal("expected error for MIME > 255 bytes")
	}

	// Boundary: a 255-byte MIME must succeed with a round-trip.
	maxMIME := strings.Repeat("y", 255)
	p, err := EncodePayload("t", &ImageAttachment{MIME: maxMIME, Data: []byte{1}})
	if err != nil {
		t.Fatalf("expected 255-byte MIME to succeed, got: %v", err)
	}
	d, err := DecodePayload(p)
	if err != nil {
		t.Fatal(err)
	}
	if d.Text != "t" || d.Image == nil || d.Image.MIME != maxMIME {
		t.Fatalf("round trip = %+v", d)
	}
}

func TestDecodeTruncatedImagePayloads(t *testing.T) {
	cases := [][]byte{
		{0x01, 0x00, 0x00},                                     // only type + partial header
		{0x01, 0x00, 0x00, 0x03, 0xe7, 0x00},                    // text_len 999 too big
		{0x01, 0x00, 0x00, 0x00, 0x00, 0xff},                    // mime_len 255 but no bytes
	}
	for _, tc := range cases {
		if _, err := DecodePayload(tc); err == nil {
			t.Fatalf("expected error for payload %x", tc)
		}
	}
}

func TestEncryptDecryptRoundTrip(t *testing.T) {
	key := bytes.Repeat([]byte{0x5a}, 32)
	id := "10000000-1000-4000-8000-100000000000"
	for _, text := range []string{"Hello, World!", "日本語テスト 🎉", ""} {
		payload, err := EncodePayload(text, nil)
		if err != nil {
			t.Fatal(err)
		}
		ct, err := Encrypt(payload, key, id)
		if err != nil {
			t.Fatal(err)
		}
		if ct[0] != 'A' { // base64 of 0x01 is 'A' as the leading char
			t.Fatalf("ciphertext %q does not start with version 0x01", ct)
		}
		decrypted, err := Decrypt(ct, key, id)
		if err != nil {
			t.Fatal(err)
		}
		if !bytes.Equal(decrypted, payload) {
			t.Fatalf("round trip mismatch: %q", text)
		}
	}
}

func TestDecryptWrongSecretIDFails(t *testing.T) {
	key := bytes.Repeat([]byte{0x5a}, 32)
	payload, _ := EncodePayload("secret", nil)
	ct, err := Encrypt(payload, key, "10000000-1000-4000-8000-100000000000")
	if err != nil {
		t.Fatal(err)
	}
	if _, err := Decrypt(ct, key, "20000000-1000-4000-8000-100000000000"); err == nil {
		t.Fatal("expected AAD mismatch error")
	}
}

func TestDecryptWrongKeyFails(t *testing.T) {
	payload, _ := EncodePayload("secret", nil)
	ct, err := Encrypt(payload, bytes.Repeat([]byte{0x01}, 32), "10000000-1000-4000-8000-100000000000")
	if err != nil {
		t.Fatal(err)
	}
	if _, err := Decrypt(ct, bytes.Repeat([]byte{0x02}, 32), "10000000-1000-4000-8000-100000000000"); err == nil {
		t.Fatal("expected wrong-key error")
	}
}

func TestDecryptBadVersionFails(t *testing.T) {
	payload, _ := EncodePayload("test", nil)
	ct, err := Encrypt(payload, bytes.Repeat([]byte{0x01}, 32), "10000000-1000-4000-8000-100000000000")
	if err != nil {
		t.Fatal(err)
	}
	raw, _ := b64Decode(ct)
	raw[0] = 0xff
	if _, err := Decrypt(b64Encode(raw), bytes.Repeat([]byte{0x01}, 32), "10000000-1000-4000-8000-100000000000"); err == nil {
		t.Fatal("expected bad-version error")
	}
}

func TestGenerateKeyIs256BitAndZeroize(t *testing.T) {
	key, err := GenerateKey()
	if err != nil {
		t.Fatal(err)
	}
	if len(key) != 32 {
		t.Fatalf("key length = %d", len(key))
	}
	Zeroize(key)
	for _, b := range key {
		if b != 0 {
			t.Fatal("Zeroize did not wipe buffer")
		}
	}
}
