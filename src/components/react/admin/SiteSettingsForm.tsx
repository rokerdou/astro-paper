import { useEffect, useState } from "react";
import { btnPrimary, card, input, label, spinnerStyle, vars } from "./styles";

interface SiteSettings {
  website: string;
  title: string;
  description: string;
  author: string;
  profile: string;
  ogImage: string;
  lang: string;
  dir: "ltr" | "rtl" | "auto";
  themeColor: string;
  copyright: string;
  footerText: string;
  githubUrl: string;
  twitterUrl: string;
  linkedinUrl: string;
  email: string;
}

const emptySettings: SiteSettings = {
  website: "",
  title: "",
  description: "",
  author: "",
  profile: "",
  ogImage: "",
  lang: "en",
  dir: "ltr",
  themeColor: "",
  copyright: "",
  footerText: "",
  githubUrl: "",
  twitterUrl: "",
  linkedinUrl: "",
  email: "",
};

function Loading() {
  return (
    <div style={{ display: "flex", justifyContent: "center", padding: "4rem 0" }}>
      <div style={{
        width: "1.5rem",
        height: "1.5rem",
        border: "2px solid var(--border)",
        borderTopColor: "var(--accent)",
        borderRadius: "50%",
        animation: "admin-spin 0.6s linear infinite",
      }} />
      <style>{spinnerStyle}</style>
    </div>
  );
}

export default function SiteSettingsForm() {
  const [settings, setSettings] = useState<SiteSettings>(emptySettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;
    void fetch("/api/settings")
      .then(response => response.json())
      .then(data => {
        if (mounted) setSettings({ ...emptySettings, ...data.settings });
      })
      .catch(() => {
        if (mounted) setError("Unable to load settings.");
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  function update<K extends keyof SiteSettings>(key: K, value: SiteSettings[K]) {
    setSettings(current => ({ ...current, [key]: value }));
  }

  async function onSubmit(event: { preventDefault: () => void }) {
    event.preventDefault();
    setSaving(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to save settings.");
      setSettings({ ...emptySettings, ...data.settings });
      setMessage("Settings saved. Public page cache was refreshed.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to save settings.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <Loading />;

  return (
    <form onSubmit={onSubmit} style={{ ...card, display: "grid", gap: "1.25rem" }}>
      <div>
        <h2 style={{
          margin: 0,
          color: "var(--foreground)",
          fontFamily: vars.font,
          fontSize: "0.9375rem",
          fontWeight: 600,
        }}>
          Site Settings
        </h2>
        <p style={{
          margin: "0.375rem 0 0",
          color: "var(--muted-foreground)",
          fontFamily: vars.font,
          fontSize: "0.8125rem",
        }}>
          These values drive public SEO tags, RSS metadata, and the header brand.
        </p>
      </div>

      <div style={{ display: "grid", gap: "1rem", gridTemplateColumns: "repeat(auto-fit, minmax(16rem, 1fr))" }}>
        <label>
          <span style={label}>Site Title</span>
          <input style={input} value={settings.title} onChange={event => update("title", event.target.value)} required />
        </label>
        <label>
          <span style={label}>Website URL</span>
          <input style={input} value={settings.website} onChange={event => update("website", event.target.value)} required />
        </label>
        <label>
          <span style={label}>Author</span>
          <input style={input} value={settings.author} onChange={event => update("author", event.target.value)} />
        </label>
        <label>
          <span style={label}>Author Profile URL</span>
          <input style={input} value={settings.profile} onChange={event => update("profile", event.target.value)} />
        </label>
        <label>
          <span style={label}>OG Image</span>
          <input style={input} value={settings.ogImage} onChange={event => update("ogImage", event.target.value)} />
        </label>
        <label>
          <span style={label}>Language</span>
          <input style={input} value={settings.lang} onChange={event => update("lang", event.target.value)} />
        </label>
        <label>
          <span style={label}>Direction</span>
          <select style={input} value={settings.dir} onChange={event => update("dir", event.target.value as SiteSettings["dir"])}>
            <option value="ltr">ltr</option>
            <option value="rtl">rtl</option>
            <option value="auto">auto</option>
          </select>
        </label>
        <label>
          <span style={label}>Theme Color</span>
          <input style={input} value={settings.themeColor} onChange={event => update("themeColor", event.target.value)} placeholder="#ffffff" />
        </label>
      </div>

      <label>
        <span style={label}>Meta Description</span>
        <textarea
          style={{ ...input, minHeight: "7rem", resize: "vertical" }}
          value={settings.description}
          onChange={event => update("description", event.target.value)}
          required
        />
      </label>

      <div>
        <h2 style={{
          margin: "0.5rem 0 0",
          color: "var(--foreground)",
          fontFamily: vars.font,
          fontSize: "0.9375rem",
          fontWeight: 600,
        }}>
          Footer
        </h2>
        <p style={{
          margin: "0.375rem 0 0",
          color: "var(--muted-foreground)",
          fontFamily: vars.font,
          fontSize: "0.8125rem",
        }}>
          These links are rendered on the server, so they do not add client-side work to public pages.
        </p>
      </div>

      <div style={{ display: "grid", gap: "1rem", gridTemplateColumns: "repeat(auto-fit, minmax(16rem, 1fr))" }}>
        <label>
          <span style={label}>Copyright Text</span>
          <input style={input} value={settings.copyright} onChange={event => update("copyright", event.target.value)} />
        </label>
        <label>
          <span style={label}>Footer Text</span>
          <input style={input} value={settings.footerText} onChange={event => update("footerText", event.target.value)} />
        </label>
        <label>
          <span style={label}>GitHub URL</span>
          <input style={input} value={settings.githubUrl} onChange={event => update("githubUrl", event.target.value)} />
        </label>
        <label>
          <span style={label}>X / Twitter URL</span>
          <input style={input} value={settings.twitterUrl} onChange={event => update("twitterUrl", event.target.value)} />
        </label>
        <label>
          <span style={label}>LinkedIn URL</span>
          <input style={input} value={settings.linkedinUrl} onChange={event => update("linkedinUrl", event.target.value)} />
        </label>
        <label>
          <span style={label}>Email</span>
          <input style={input} value={settings.email} onChange={event => update("email", event.target.value)} />
        </label>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
        <button type="submit" style={{ ...btnPrimary, opacity: saving ? 0.6 : 1 }} disabled={saving}>
          {saving ? "Saving..." : "Save Settings"}
        </button>
        {message && <span style={{ color: "var(--accent)", fontFamily: vars.font, fontSize: "0.8125rem" }}>{message}</span>}
        {error && <span style={{ color: "#dc2626", fontFamily: vars.font, fontSize: "0.8125rem" }}>{error}</span>}
      </div>
    </form>
  );
}
