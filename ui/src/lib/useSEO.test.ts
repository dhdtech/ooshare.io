import { describe, it, expect, vi, afterEach, beforeEach } from "vitest";
import { renderHook } from "@testing-library/react";
import useSEO from "./useSEO";

function seedHead() {
  // Mirror ui/index.html head elements that useSEO updates.
  const head = document.head;
  const robots = document.createElement("meta");
  robots.setAttribute("name", "robots");
  robots.setAttribute("content", "index, follow");
  head.appendChild(robots);
  const canonical = document.createElement("link");
  canonical.setAttribute("rel", "canonical");
  canonical.setAttribute("href", "https://ooshare.io/");
  head.appendChild(canonical);
  const desc = document.createElement("meta");
  desc.setAttribute("name", "description");
  desc.setAttribute("content", "x");
  head.appendChild(desc);
  const og = document.createElement("meta");
  og.setAttribute("property", "og:title");
  head.appendChild(og);
}

function clearHead() {
  document.querySelectorAll('meta[name="robots"]').forEach((el) => el.remove());
  document.querySelectorAll('meta[name="description"]').forEach((el) => el.remove());
  document.querySelectorAll("link[rel='canonical']").forEach((el) => el.remove());
  document.querySelectorAll("link[hreflang]").forEach((el) => el.remove());
  document.querySelectorAll('meta[property="og:title"]').forEach((el) => el.remove());
}

function renderSEO(props: Parameters<typeof useSEO>[0]) {
  renderHook(() => useSEO(props));
}

describe("useSEO", () => {
  beforeEach(() => {
    seedHead();
  });
  afterEach(() => {
    clearHead();
    vi.restoreAllMocks();
  });

  it("sets title, canonical, og and hreflang for an indexed page", () => {
    renderSEO({ title: "Home", description: "desc", path: "/" });
    expect(document.title).toBe("Home");
    expect(document.querySelector('link[rel="canonical"]')).toHaveAttribute("href", "https://ooshare.io/");
    expect(document.querySelector('link[hreflang="en"]')).toBeInTheDocument();
    expect(document.querySelector('meta[property="og:title"]')).toHaveAttribute("content", "Home");
    expect(document.querySelector('meta[name="robots"]')).toHaveAttribute("content", "index, follow");
  });

  it("marks noindex + nofollow and removes canonical/hreflang when noindex is set", () => {
    // seed canonical + hreflang via an indexed page first, then switch to noindex
    renderSEO({ title: "A", description: "a", path: "/security" });
    expect(document.querySelector('link[rel="canonical"]')).toBeInTheDocument();

    renderSEO({
      title: "Internal",
      description: "internal",
      path: "/components",
      noindex: true,
    });

    expect(document.querySelector('meta[name="robots"]')).toHaveAttribute("content", "noindex, nofollow");
    expect(document.querySelector('link[rel="canonical"]')).not.toBeInTheDocument();
    expect(document.querySelector('link[hreflang]')).not.toBeInTheDocument();
    // OG still set for the noindex page
    expect(document.querySelector('meta[property="og:title"]')).toHaveAttribute("content", "Internal");
  });

  it("keeps index, follow for a normal page (noindex unset)", () => {
    renderSEO({ title: "Normal", description: "d", path: "/faq" });
    expect(document.querySelector('meta[name="robots"]')).toHaveAttribute("content", "index, follow");
    expect(document.querySelector('link[rel="canonical"]')).toHaveAttribute("href", "https://ooshare.io/faq");
  });
});
