// Package api is a Go port of ui/src/lib/api.ts.
package api

import (
	"bytes"
	"context"
	"encoding/json"
	"errors"
	"io"
	"net/http"
)

// Client talks to the ooshare API.
type Client struct {
	BaseURL string
	HTTP    *http.Client
}

// CreateResult is the server response to POST /api/secrets.
type CreateResult struct {
	ID    string `json:"id"`
	Alias string `json:"alias"`
}

// CreateSecret stores a ciphertext and returns {id, alias}.
func (c *Client) CreateSecret(ctx context.Context, ciphertext string, ttlHours int, id string) (*CreateResult, error) {
	body, err := json.Marshal(map[string]any{
		"ciphertext": ciphertext,
		"ttl_hours":  ttlHours,
		"id":         id,
	})
	if err != nil {
		return nil, err
	}
	req, err := http.NewRequestWithContext(ctx, http.MethodPost, c.BaseURL+"/api/secrets", bytes.NewReader(body))
	if err != nil {
		return nil, err
	}
	req.Header.Set("Content-Type", "application/json")
	resp, err := c.HTTP.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()
	if resp.StatusCode != http.StatusCreated {
		return nil, decodeError(resp, "Failed to create secret")
	}
	var out CreateResult
	if err := json.NewDecoder(resp.Body).Decode(&out); err != nil {
		return nil, err
	}
	return &out, nil
}

// GetSecret retrieves and atomically deletes a secret. id may be a UUID or an
// alias; the returned actualID is always the UUID used for decryption.
func (c *Client) GetSecret(ctx context.Context, id string) (ciphertext string, actualID string, err error) {
	req, err := http.NewRequestWithContext(ctx, http.MethodGet, c.BaseURL+"/api/secrets/"+id, nil)
	if err != nil {
		return "", "", err
	}
	resp, err := c.HTTP.Do(req)
	if err != nil {
		return "", "", err
	}
	defer resp.Body.Close()
	if resp.StatusCode == http.StatusNotFound {
		return "", "", errors.New("Secret not found or already viewed")
	}
	if resp.StatusCode != http.StatusOK {
		return "", "", decodeError(resp, "Failed to retrieve secret")
	}
	var out struct {
		Ciphertext string `json:"ciphertext"`
		ID         string `json:"id"`
	}
	if err := json.NewDecoder(resp.Body).Decode(&out); err != nil {
		return "", "", err
	}
	return out.Ciphertext, out.ID, nil
}

// decodeError reads the server's {error: msg} JSON and falls back to a default message.
func decodeError(resp *http.Response, fallback string) error {
	var e struct {
		Error string `json:"error"`
	}
	data, _ := io.ReadAll(resp.Body)
	if len(data) > 0 && json.Unmarshal(data, &e) == nil && e.Error != "" {
		return errors.New(e.Error)
	}
	return errors.New(fallback)
}
