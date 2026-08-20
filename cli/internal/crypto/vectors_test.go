package crypto

import (
	"bytes"
	"testing"
)

// Golden vectors generated from Node's Web Crypto API (the same primitives the
// browser uses) by cli/scripts/gen-vectors.mjs with these fixed inputs:
//
//	masterKey = 0x00..0x1f (32 bytes)
//	secretID  = "10000000-1000-4000-8000-100000000000"
//	iv        = 0x00..0x0b (12 bytes)

func vectorKey() []byte {
	k := make([]byte, 32)
	for i := range k {
		k[i] = byte(i)
	}
	return k
}

func vectorSecretID() string { return "10000000-1000-4000-8000-100000000000" }

func vectorIV() []byte {
	iv := make([]byte, 12)
	for i := range iv {
		iv[i] = byte(i)
	}
	return iv
}

const (
	vectorTextCiphertext = "AQABAgMEBQYHCAkKCybLdY9Wvn4ZDrWJ9UPv6UAvMm2crfa7eG/ATpXVXw=="
	vectorImgCiphertext  = "AQABAgMEBQYHCAkKCyeDEOM9kjNJLbOU9y6n7h0dnDcQSjW8G4w42zLlp3IHj8IHpDDkkLcx9Q=="
	vectorKeyB64url      = "AAECAwQFBgcICQoLDA0ODxAREhMUFRYXGBkaGxwdHh8"
)

func TestMasterKeyBase64url(t *testing.T) {
	if got := Base64urlEncode(vectorKey()); got != vectorKeyB64url {
		t.Fatalf("master key base64url = %q, want %q", got, vectorKeyB64url)
	}
}

func TestEncryptWithFixedIVMatchesGoldenText(t *testing.T) {
	payload, err := EncodePayload("Hello, World!", nil)
	if err != nil {
		t.Fatal(err)
	}
	got, err := encryptWithIV(payload, vectorKey(), vectorSecretID(), vectorIV())
	if err != nil {
		t.Fatal(err)
	}
	if got != vectorTextCiphertext {
		t.Fatalf("ciphertext mismatch:\n got  %s\n want %s", got, vectorTextCiphertext)
	}
}

func TestEncryptWithFixedIVMatchesGoldenImage(t *testing.T) {
	payload, err := EncodePayload("Caption", &ImageAttachment{MIME: "image/png", Data: []byte{0x89, 0x50, 0x4e, 0x47}})
	if err != nil {
		t.Fatal(err)
	}
	got, err := encryptWithIV(payload, vectorKey(), vectorSecretID(), vectorIV())
	if err != nil {
		t.Fatal(err)
	}
	if got != vectorImgCiphertext {
		t.Fatalf("ciphertext mismatch:\n got  %s\n want %s", got, vectorImgCiphertext)
	}
}

func TestDecryptGoldenText(t *testing.T) {
	want, err := EncodePayload("Hello, World!", nil)
	if err != nil {
		t.Fatal(err)
	}
	got, err := Decrypt(vectorTextCiphertext, vectorKey(), vectorSecretID())
	if err != nil {
		t.Fatal(err)
	}
	if !bytes.Equal(got, want) {
		t.Fatalf("decrypt mismatch: got %q want %q", got, want)
	}
}
