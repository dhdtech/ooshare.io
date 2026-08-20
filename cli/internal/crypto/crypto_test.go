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
