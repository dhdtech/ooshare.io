import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { PostHogProvider } from "posthog-js/react";
import posthog from "./lib/posthog";
import Layout from "./components/Layout";
import CreateSecret from "./pages/CreateSecret";
import ViewSecret from "./pages/ViewSecret";
import Security from "./pages/Security";
import About from "./pages/About";
import WhyOOShare from "./pages/WhyOOShare";
import FAQ from "./pages/FAQ";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import CLI from "./pages/CLI";
import NotFound from "./pages/NotFound";
import Components from "./pages/Components";
import "./i18n";
import "./index.css";

const app = (
  <StrictMode>
    <PostHogProvider client={posthog}>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<CreateSecret />} />
            <Route path="/s/:id" element={<ViewSecret />} />
            <Route path="/security" element={<Security />} />
            <Route path="/about" element={<About />} />
            <Route path="/why" element={<WhyOOShare />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="/cli" element={<CLI />} />
            <Route path="/components" element={<Components />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </PostHogProvider>
  </StrictMode>
);

const root = document.getElementById("root")!;

// Always use createRoot (not hydrateRoot). Pre-rendered HTML is for SEO
// crawlers only — they parse the static HTML directly. Interactive users
// get the full React app. This avoids all hydration mismatch errors (#418)
// caused by i18n language differences, Puppeteer serialization quirks,
// or analytics scripts modifying the DOM.
createRoot(root).render(app);
