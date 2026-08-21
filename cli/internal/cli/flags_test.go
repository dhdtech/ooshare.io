package cli

import (
	"flag"
	"reflect"
	"testing"
)

func TestReorderArgs(t *testing.T) {
	fs := flag.NewFlagSet("t", flag.ContinueOnError)
	output := fs.String("output", "", "")
	json := fs.Bool("json", false, "")
	fs.Int("ttl", 24, "")

	cases := []struct {
		name string
		args []string
		want []string
	}{
		{"url then flags", []string{"https://x#k", "--output", "/tmp", "--json"}, []string{"--output", "/tmp", "--json", "https://x#k"}},
		{"flags then url", []string{"--output", "/tmp", "https://x#k"}, []string{"--output", "/tmp", "https://x#k"}},
		{"bool then url then value flag", []string{"--json", "https://x#k", "--ttl", "1"}, []string{"--json", "--ttl", "1", "https://x#k"}},
		{"equals form", []string{"https://x#k", "--ttl=1"}, []string{"--ttl=1", "https://x#k"}},
		{"bare positional", []string{"https://x#k"}, []string{"https://x#k"}},
		{"double dash terminator", []string{"--", "--output"}, []string{"--", "--output"}},
	}
	for _, tc := range cases {
		got := reorderArgs(fs, tc.args)
		if !reflect.DeepEqual(got, tc.want) {
			t.Errorf("%s: reorderArgs(%v) = %v, want %v", tc.name, tc.args, got, tc.want)
		}
	}
	// After reorder, parsing must succeed and leave exactly the URL as positional.
	reordered := reorderArgs(fs, []string{"https://x#k", "--output", "/tmp"})
	if err := fs.Parse(reordered); err != nil {
		t.Fatalf("parse: %v", err)
	}
	if fs.NArg() != 1 || fs.Arg(0) != "https://x#k" {
		t.Fatalf("narg=%d arg0=%q, want 1 url", fs.NArg(), fs.Arg(0))
	}
	if *output != "/tmp" {
		t.Fatalf("output = %q", *output)
	}
	_ = json
}
