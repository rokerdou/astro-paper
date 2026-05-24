import { useState, useCallback } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Markdown } from "tiptap-markdown";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useCreatePost, useUpdatePost, useTags, type Post } from "./hooks";

const queryClient = new QueryClient({ defaultOptions: { queries: { staleTime: 60_000 } } });

const input: React.CSSProperties = {
  width: "100%",
  padding: "0.625rem 0.875rem",
  border: "1px solid var(--border)",
  borderRadius: "0.5rem",
  background: "var(--background)",
  color: "var(--foreground)",
  fontSize: "0.875rem",
  lineHeight: 1.5,
  transition: "border-color 0.15s, box-shadow 0.15s",
  outline: "none",
  boxSizing: "border-box",
};

const label: React.CSSProperties = {
  display: "block",
  fontSize: "0.75rem",
  fontWeight: 600,
  textTransform: "uppercase" as const,
  letterSpacing: "0.06em",
  color: "var(--muted-foreground)",
  marginBottom: "0.375rem",
};

const sectionBox: React.CSSProperties = {
  background: "var(--background)",
  border: "1px solid var(--border)",
  borderRadius: "0.75rem",
  padding: "1.25rem",
};

const btnPrimary: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "0.625rem 1.75rem",
  border: "none",
  borderRadius: "0.5rem",
  background: "var(--accent)",
  color: "#fff",
  fontSize: "0.875rem",
  fontWeight: 600,
  cursor: "pointer",
  transition: "opacity 0.15s",
  boxShadow: "0 1px 2px rgba(0,0,0,0.08)",
};

const btnSecondary: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "0.625rem 1.25rem",
  border: "1px solid var(--border)",
  borderRadius: "0.5rem",
  background: "transparent",
  color: "var(--foreground)",
  fontSize: "0.875rem",
  fontWeight: 500,
  cursor: "pointer",
  textDecoration: "none",
  transition: "border-color 0.15s",
};

function PostEditorInner({ post }: { post?: Post }) {
  const isEdit = !!post;
  const createPost = useCreatePost();
  const updatePost = useUpdatePost();

  const [title, setTitle] = useState(post?.title || "");
  const [description, setDescription] = useState(post?.description || "");
  const [author, setAuthor] = useState(post?.author || "");
  const [coverImage, setCoverImage] = useState(post?.coverImage || "");
  const [draft, setDraft] = useState(post?.draft ?? true);
  const [featured, setFeatured] = useState(post?.featured ?? false);
  const [tagInput, setTagInput] = useState(post?.tags.map(t => t.name).join(", ") || "");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const editor = useEditor({
    extensions: [StarterKit, Markdown],
    content: post?.body || "",
    editorProps: {
      attributes: {
        style: "outline: none; min-height: 20rem; font-size: 0.9375rem; line-height: 1.7; color: var(--foreground);",
      },
    },
  });

  const handleSave = useCallback(async () => {
    if (!title.trim()) return;
    setSaving(true);
    setSaved(false);

    const body = editor?.storage.markdown?.getMarkdown() || "";
    const tags = tagInput.split(",").map(t => t.trim()).filter(Boolean);
    const now = new Date().toISOString();

    const payload = {
      title, description, body, author,
      coverImage: coverImage || null,
      draft, featured, tags,
      pubDatetime: post?.pubDatetime || now,
      modDatetime: now,
    };

    try {
      if (isEdit && post) {
        await updatePost.mutateAsync({ slug: post.slug, ...payload });
      } else {
        await createPost.mutateAsync(payload);
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } finally {
      setSaving(false);
    }
  }, [title, description, editor, tagInput, author, coverImage, draft, featured, post, isEdit, createPost, updatePost]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>

      {/* Title */}
      <div style={sectionBox}>
        <input
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Post title..."
          style={{
            ...input,
            border: "none",
            fontSize: "1.375rem",
            fontWeight: 700,
            padding: "0.25rem 0",
            letterSpacing: "-0.01em",
            background: "transparent",
          }}
        />
      </div>

      {/* Metadata grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
        <div style={sectionBox}>
          <label style={label}>Description</label>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Brief description..."
            style={{ ...input, minHeight: "5rem", resize: "vertical" }}
          />
        </div>
        <div style={{ ...sectionBox, display: "flex", flexDirection: "column", gap: "0.875rem" }}>
          <div>
            <label style={label}>Author</label>
            <input style={input} value={author} onChange={e => setAuthor(e.target.value)} placeholder="Author name" />
          </div>
          <div>
            <label style={label}>Tags</label>
            <input style={input} value={tagInput} onChange={e => setTagInput(e.target.value)} placeholder="Comma separated" />
          </div>
        </div>
      </div>

      {/* Cover image + toggles */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: "1rem", alignItems: "start" }}>
        <div style={sectionBox}>
          <label style={label}>Cover Image URL</label>
          <input style={input} value={coverImage} onChange={e => setCoverImage(e.target.value)} placeholder="https://..." />
        </div>
        <div style={{ ...sectionBox, display: "flex", gap: "1.25rem", padding: "0.875rem 1.25rem" }}>
          <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer", fontSize: "0.875rem" }}>
            <input type="checkbox" checked={draft} onChange={e => setDraft(e.target.checked)}
              style={{ accentColor: "var(--accent)" }} />
            <span style={{ color: draft ? "#d97706" : "var(--muted-foreground)", fontWeight: 500 }}>Draft</span>
          </label>
          <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer", fontSize: "0.875rem" }}>
            <input type="checkbox" checked={featured} onChange={e => setFeatured(e.target.checked)}
              style={{ accentColor: "var(--accent)" }} />
            <span style={{ color: featured ? "var(--accent)" : "var(--muted-foreground)", fontWeight: 500 }}>Featured</span>
          </label>
        </div>
      </div>

      {/* Editor */}
      <div style={{ ...sectionBox, padding: 0, overflow: "hidden" }}>
        <div style={{
          padding: "0.5rem 1rem",
          borderBottom: "1px solid var(--border)",
          fontSize: "0.6875rem",
          fontWeight: 600,
          textTransform: "uppercase",
          letterSpacing: "0.08em",
          color: "var(--muted-foreground)",
        }}>
          Markdown Content
        </div>
        <div style={{ padding: "1rem 1.25rem", minHeight: "22rem" }}>
          <EditorContent editor={editor} />
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end", alignItems: "center" }}>
        {saved && (
          <span style={{ fontSize: "0.8125rem", color: "#16a34a", fontWeight: 500 }}>
            Saved successfully
          </span>
        )}
        <a href="/admin" style={btnSecondary}>Cancel</a>
        <button
          onClick={handleSave}
          disabled={saving || !title.trim()}
          style={{
            ...btnPrimary,
            opacity: saving || !title.trim() ? 0.5 : 1,
            cursor: saving || !title.trim() ? "not-allowed" : "pointer",
          }}
        >
          {saving ? "Saving..." : isEdit ? "Update Post" : "Publish Post"}
        </button>
      </div>
    </div>
  );
}

export default function PostEditor(props: { post?: Post }) {
  return (
    <QueryClientProvider client={queryClient}>
      <PostEditorInner {...props} />
    </QueryClientProvider>
  );
}
