import { useState, useEffect, useCallback } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Markdown } from "tiptap-markdown";
import { useCreatePost, useUpdatePost, useTags, type Post } from "./hooks";

interface Props {
  post?: Post;
}

export default function PostEditor({ post }: Props) {
  const isEdit = !!post;
  const createPost = useCreatePost();
  const updatePost = useUpdatePost();
  const { data: allTags } = useTags();

  const [title, setTitle] = useState(post?.title || "");
  const [description, setDescription] = useState(post?.description || "");
  const [author, setAuthor] = useState(post?.author || "");
  const [coverImage, setCoverImage] = useState(post?.coverImage || "");
  const [draft, setDraft] = useState(post?.draft ?? true);
  const [featured, setFeatured] = useState(post?.featured ?? false);
  const [tagInput, setTagInput] = useState(post?.tags.map(t => t.name).join(", ") || "");
  const [saving, setSaving] = useState(false);

  const editor = useEditor({
    extensions: [StarterKit, Markdown],
    content: post?.body || "",
  });

  const handleSave = useCallback(async () => {
    if (!title.trim()) return;
    setSaving(true);

    const body = editor?.storage.markdown?.getMarkdown() || "";
    const tags = tagInput.split(",").map(t => t.trim()).filter(Boolean);
    const now = new Date().toISOString();

    const payload = {
      title,
      description,
      body,
      author,
      coverImage: coverImage || null,
      draft,
      featured,
      tags,
      pubDatetime: post?.pubDatetime || now,
      modDatetime: now,
    };

    try {
      if (isEdit && post) {
        await updatePost.mutateAsync({ slug: post.slug, ...payload });
      } else {
        await createPost.mutateAsync(payload);
      }
    } finally {
      setSaving(false);
    }
  }, [title, description, editor, tagInput, author, coverImage, draft, featured, post, isEdit, createPost, updatePost]);

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "0.5rem 0.75rem",
    border: "1px solid var(--border)",
    borderRadius: "0.375rem",
    background: "var(--background)",
    color: "var(--foreground)",
    fontSize: "0.875rem",
  };

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontSize: "0.875rem",
    fontWeight: 500,
    marginBottom: "0.25rem",
    color: "var(--foreground)",
  };

  return (
    <div style={{ maxWidth: "48rem", margin: "0 auto" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <div>
          <label style={labelStyle}>Title *</label>
          <input style={{ ...inputStyle, fontSize: "1.25rem", fontWeight: 600 }} value={title} onChange={e => setTitle(e.target.value)} placeholder="Post title" />
        </div>

        <div>
          <label style={labelStyle}>Description</label>
          <textarea style={{ ...inputStyle, minHeight: "4rem" }} value={description} onChange={e => setDescription(e.target.value)} placeholder="Brief description..." />
        </div>

        <div>
          <label style={labelStyle}>Tags (comma separated)</label>
          <input style={inputStyle} value={tagInput} onChange={e => setTagInput(e.target.value)} placeholder="docs, astro, react" />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
          <div>
            <label style={labelStyle}>Author</label>
            <input style={inputStyle} value={author} onChange={e => setAuthor(e.target.value)} />
          </div>
          <div>
            <label style={labelStyle}>Cover Image URL</label>
            <input style={inputStyle} value={coverImage} onChange={e => setCoverImage(e.target.value)} placeholder="https://..." />
          </div>
        </div>

        <div style={{ display: "flex", gap: "1.5rem", alignItems: "center" }}>
          <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer" }}>
            <input type="checkbox" checked={draft} onChange={e => setDraft(e.target.checked)} />
            <span style={{ fontSize: "0.875rem" }}>Draft</span>
          </label>
          <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer" }}>
            <input type="checkbox" checked={featured} onChange={e => setFeatured(e.target.checked)} />
            <span style={{ fontSize: "0.875rem" }}>Featured</span>
          </label>
        </div>

        <div>
          <label style={labelStyle}>Content (Markdown)</label>
          <div style={{
            border: "1px solid var(--border)",
            borderRadius: "0.375rem",
            minHeight: "24rem",
            padding: "0.75rem",
            background: "var(--background)",
          }}>
            <EditorContent editor={editor} />
          </div>
        </div>

        <div style={{ display: "flex", gap: "0.5rem", justifyContent: "flex-end" }}>
          <button
            onClick={handleSave}
            disabled={saving || !title.trim()}
            style={{
              padding: "0.5rem 1.5rem",
              border: "none",
              borderRadius: "0.375rem",
              background: saving ? "var(--border)" : "var(--accent)",
              color: "#fff",
              cursor: saving ? "not-allowed" : "pointer",
              fontWeight: 500,
            }}
          >
            {saving ? "Saving..." : isEdit ? "Update" : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
}
