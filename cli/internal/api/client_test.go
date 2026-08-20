package api

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"
)

func newServer(t *testing.T, handler http.HandlerFunc) *Client {
	t.Helper()
	srv := httptest.NewServer(handler)
	t.Cleanup(srv.Close)
	return &Client{BaseURL: srv.URL, HTTP: srv.Client()}
}

func TestCreateSecretSendsCorrectRequest(t *testing.T) {
	var gotBody map[string]any
	var gotPath string
	c := newServer(t, func(w http.ResponseWriter, r *http.Request) {
		gotPath = r.URL.Path
		json.NewDecoder(r.Body).Decode(&gotBody)
		w.WriteHeader(http.StatusCreated)
		fmt.Fprint(w, `{"id":"uuid-123","alias":"AbCd1234"}`)
	})

	res, err := c.CreateSecret(context.Background(), "ct", 24, "uuid-123")
	if err != nil {
		t.Fatal(err)
	}
	if gotPath != "/api/secrets" {
		t.Fatalf("path = %q", gotPath)
	}
	if gotBody["ciphertext"] != "ct" || gotBody["ttl_hours"] != float64(24) || gotBody["id"] != "uuid-123" {
		t.Fatalf("body = %+v", gotBody)
	}
	if res.ID != "uuid-123" || res.Alias != "AbCd1234" {
		t.Fatalf("result = %+v", res)
	}
}

func TestCreateSecretServerError(t *testing.T) {
	c := newServer(t, func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusBadRequest)
		fmt.Fprint(w, `{"error":"ciphertext is required and must be a string"}`)
	})
	_, err := c.CreateSecret(context.Background(), "ct", 24, "id")
	if err == nil || !strings.Contains(err.Error(), "ciphertext is required") {
		t.Fatalf("err = %v", err)
	}
}

func TestCreateSecretServerErrorNoMessage(t *testing.T) {
	c := newServer(t, func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusInternalServerError)
		fmt.Fprint(w, `{}`)
	})
	_, err := c.CreateSecret(context.Background(), "ct", 24, "id")
	if err == nil || err.Error() != "Failed to create secret" {
		t.Fatalf("err = %v", err)
	}
}

func TestGetSecretByAliasReturnsRealUUID(t *testing.T) {
	var gotPath string
	c := newServer(t, func(w http.ResponseWriter, r *http.Request) {
		gotPath = r.URL.Path
		fmt.Fprint(w, `{"ciphertext":"data","id":"real-uuid"}`)
	})
	ct, actualID, err := c.GetSecret(context.Background(), "alias123")
	if err != nil {
		t.Fatal(err)
	}
	if gotPath != "/api/secrets/alias123" {
		t.Fatalf("path = %q", gotPath)
	}
	if ct != "data" || actualID != "real-uuid" {
		t.Fatalf("got %q, %q", ct, actualID)
	}
}

func TestGetSecret404(t *testing.T) {
	c := newServer(t, func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusNotFound)
		fmt.Fprint(w, `{"error":"Secret not found or already viewed"}`)
	})
	_, _, err := c.GetSecret(context.Background(), "missing")
	if err == nil || err.Error() != "Secret not found or already viewed" {
		t.Fatalf("err = %v", err)
	}
}

func TestGetSecretOtherError(t *testing.T) {
	c := newServer(t, func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusInternalServerError)
		fmt.Fprint(w, `{"error":"Internal error"}`)
	})
	if _, _, err := c.GetSecret(context.Background(), "id"); err == nil || err.Error() != "Internal error" {
		t.Fatalf("err = %v", err)
	}
}

func TestCreateSecretTransportError(t *testing.T) {
	srv := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {}))
	url := srv.URL
	srv.Close() // now refusing connections -> c.HTTP.Do fails
	c := &Client{BaseURL: url, HTTP: srv.Client()}
	if _, err := c.CreateSecret(context.Background(), "ct", 24, "id"); err == nil {
		t.Fatal("expected transport error")
	}
}

func TestCreateSecretBadJSON(t *testing.T) {
	c := newServer(t, func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusCreated)
		fmt.Fprint(w, `{not json`)
	})
	if _, err := c.CreateSecret(context.Background(), "ct", 24, "id"); err == nil {
		t.Fatal("expected decode error")
	}
}

func TestGetSecretTransportError(t *testing.T) {
	srv := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {}))
	url := srv.URL
	srv.Close()
	c := &Client{BaseURL: url, HTTP: srv.Client()}
	if _, _, err := c.GetSecret(context.Background(), "id"); err == nil {
		t.Fatal("expected transport error")
	}
}

func TestGetSecretBadJSON(t *testing.T) {
	c := newServer(t, func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprint(w, `{not json`)
	})
	if _, _, err := c.GetSecret(context.Background(), "id"); err == nil {
		t.Fatal("expected decode error")
	}
}
