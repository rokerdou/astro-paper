import { useRef, useState, useCallback, type DragEvent } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { slugifyStr } from "@/utils/slugify";
import {
  useCreatePost,
  useUpdatePost,
  type Post,
  type CreatePostInput,
  type UpdatePostInput,
} from "./hooks";
import { vars, input, label, card, btnPrimary, btnSecondary } from "./styles";

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 60_000 } },
});

interface UploadedAsset {
  markdown: string;
}

const responsiveCss = `
@media (max-width: 640px) {
  .pe-meta { grid-template-columns: 1fr !important; }
  .pe-cover { grid-template-columns: 1fr !important; }
  .pe-title { font-size: 1.125rem !important; }
  .pe-body { min-height: 16rem !important; }
}
`;

function PostEditorInner({ post }: { post?: Post }) {
  const isEdit = !!post;
  const createPost = useCreatePost();
  const updatePost = useUpdatePost();
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [title, setTitle] = useState(post?.title || "");
  const [slug, setSlug] = useState(post?.slug || "");
  const [slugEdited, setSlugEdited] = useState(isEdit);
  const [description, setDescription] = useState(post?.description || "");
  const [author, setAuthor] = useState(post?.author || "");
  const [coverImage, setCoverImage] = useState(post?.coverImage || "");
  const [draft, setDraft] = useState(post?.draft ?? true);
  const [featured, setFeatured] = useState(post?.featured ?? false);
  const [tagInput, setTagInput] = useState(
    post?.tags.map(t => t.name).join(", ") || ""
  );
  const [body, setBody] = useState(post?.body || "");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const insertMarkdown = useCallback(
    (markdown: string) => {
      const textarea = textareaRef.current;
      const start = textarea?.selectionStart ?? body.length;
      const end = textarea?.selectionEnd ?? body.length;
      const before = body.slice(0, start);
      const after = body.slice(end);
      const prefix = before && !before.endsWith("\n") ? "\n" : "";
      const suffix = after && !after.startsWith("\n") ? "\n" : "";
      const insertion = `${prefix}${markdown}${suffix}`;
      const nextBody = `${before}${insertion}${after}`;

      setBody(nextBody);
      requestAnimationFrame(() => {
        textarea?.focus();
        const cursor = start + insertion.length;
        textarea?.setSelectionRange(cursor, cursor);
      });
    },
    [body]
  );

  const uploadFiles = useCallback(
    async (files: FileList | File[]) => {
      const selectedFiles = Array.from(files);
      if (selectedFiles.length === 0) return;

      setUploading(true);
      setError("");

      try {
        const formData = new FormData();
        for (const file of selectedFiles) {
          formData.append("files", file);
        }

        const response = await fetch("/api/uploads", {
          method: "POST",
          body: formData,
        });
        const data = (await response.json()) as {
          error?: string;
          uploads: UploadedAsset[];
        };
        if (!response.ok)
          throw new Error(data.error || "Unable to upload files");

        const markdown = (data.uploads as UploadedAsset[])
          .map(upload => upload.markdown)
          .join("\n\n");
        insertMarkdown(markdown);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Unable to upload files");
      } finally {
        setUploading(false);
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
    },
    [insertMarkdown]
  );

  const handleDrop = useCallback(
    (event: DragEvent<HTMLTextAreaElement>) => {
      if (event.dataTransfer.files.length === 0) return;
      event.preventDefault();
      void uploadFiles(event.dataTransfer.files);
    },
    [uploadFiles]
  );

  const handleSave = useCallback(async () => {
    if (!title.trim()) return;
    if (isEdit && !slug.trim()) {
      setError("Post URL is required.");
      return;
    }

    setSaving(true);
    setSaved(false);
    setError("");

    const tags = tagInput
      .split(",")
      .map(t => t.trim())
      .filter(Boolean);
    const now = new Date().toISOString();

    const base = {
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
        const result = await updatePost.mutateAsync({
          currentSlug: post.slug,
          slug: slug.trim(),
          ...base,
        } as UpdatePostInput);
        if (result.post.slug !== post.slug) {
          window.location.href = `/admin/posts/edit/${encodeURIComponent(result.post.slug)}`;
          return;
        }
      } else {
        const result = await createPost.mutateAsync({
          slug: slug.trim() || undefined,
          ...base,
        } as CreatePostInput);
        window.location.href = `/admin/posts/edit/${encodeURIComponent(result.post.slug)}`;
        return;
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  }, [
    title,
    slug,
    description,
    body,
    tagInput,
    author,
    coverImage,
    draft,
    featured,
    post,
    isEdit,
    createPost,
    updatePost,
  ]);

  const canSave =
    title.trim().length > 0 && (!isEdit || slug.trim().length > 0);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <style>{responsiveCss}</style>

      {/* Title */}
      <div style={card}>
        <input
          value={title}
          onChange={e => {
            const nextTitle = e.target.value;
            setTitle(nextTitle);
            if (!slugEdited) setSlug(slugifyStr(nextTitle));
          }}
          placeholder="Post title..."
          className="pe-title"
          style={{
            ...input,
            border: "none",
            fontSize: "1.25rem",
            fontWeight: 700,
            padding: "0.25rem 0",
            letterSpacing: "-0.01em",
            background: "transparent",
          }}
        />
      </div>

      {/* Metadata */}
      <div
        className="pe-meta"
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}
      >
        <div style={card}>
          <label style={label}>Description</label>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Brief description..."
            rows={3}
            style={{ ...input, minHeight: "4.5rem", resize: "vertical" }}
          />
        </div>
        <div
          style={{
            ...card,
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
          }}
        >
          <div>
            <label style={label}>Author</label>
            <input
              style={input}
              value={author}
              onChange={e => setAuthor(e.target.value)}
              placeholder="Author name"
            />
          </div>
          <div>
            <label style={label}>Post URL</label>
            <div style={{ display: "flex", alignItems: "stretch" }}>
              <span
                style={{
                  ...input,
                  borderTopRightRadius: 0,
                  borderBottomRightRadius: 0,
                  borderRight: "none",
                  width: "auto",
                  color: "var(--muted-foreground)",
                  whiteSpace: "nowrap",
                }}
              >
                /posts/
              </span>
              <input
                style={{
                  ...input,
                  borderTopLeftRadius: 0,
                  borderBottomLeftRadius: 0,
                }}
                value={slug}
                onChange={e => {
                  setSlug(slugifyStr(e.target.value));
                  setSlugEdited(true);
                }}
                placeholder="post-url"
                required={isEdit}
              />
            </div>
            {slug && (
              <a
                href={`/posts/${slug}/`}
                target="_blank"
                rel="noreferrer"
                style={{
                  display: "inline-block",
                  marginTop: "0.375rem",
                  color: "var(--muted-foreground)",
                  fontFamily: vars.font,
                  fontSize: "0.75rem",
                  textDecoration: "none",
                }}
              >
                View public URL
              </a>
            )}
          </div>
          <div>
            <label style={label}>Tags</label>
            <input
              style={input}
              value={tagInput}
              onChange={e => setTagInput(e.target.value)}
              placeholder="Comma separated"
            />
          </div>
        </div>
      </div>

      {/* Cover image + toggles */}
      <div
        className="pe-cover"
        style={{
          display: "grid",
          gridTemplateColumns: "1fr auto",
          gap: "1rem",
          alignItems: "start",
        }}
      >
        <div style={card}>
          <label style={label}>Cover Image URL</label>
          <input
            style={input}
            value={coverImage}
            onChange={e => setCoverImage(e.target.value)}
            placeholder="https://..."
          />
        </div>
        <div
          style={{
            ...card,
            display: "flex",
            gap: "1rem",
            padding: "0.75rem 1.25rem",
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              cursor: "pointer",
              fontSize: "0.8125rem",
            }}
          >
            <input
              type="checkbox"
              checked={draft}
              onChange={e => setDraft(e.target.checked)}
              style={{ accentColor: "var(--accent)" }}
            />
            <span
              style={{
                color: draft ? "#d97706" : "var(--muted-foreground)",
                fontWeight: 600,
                fontFamily: vars.font,
              }}
            >
              Draft
            </span>
          </label>
          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              cursor: "pointer",
              fontSize: "0.8125rem",
            }}
          >
            <input
              type="checkbox"
              checked={featured}
              onChange={e => setFeatured(e.target.checked)}
              style={{ accentColor: "var(--accent)" }}
            />
            <span
              style={{
                color: featured ? "var(--accent)" : "var(--muted-foreground)",
                fontWeight: 600,
                fontFamily: vars.font,
              }}
            >
              Featured
            </span>
          </label>
        </div>
      </div>

      {/* Markdown editor */}
      <div style={{ ...card, padding: 0, overflow: "hidden" }}>
        <div
          style={{
            padding: "0.625rem 1.25rem",
            borderBottom: "1px solid var(--border)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <span
            style={{
              fontSize: "0.6875rem",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              color: "var(--muted-foreground)",
            }}
          >
            Markdown
          </span>
          <div
            style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}
          >
            <span
              style={{
                fontSize: "0.6875rem",
                color: "var(--muted-foreground)",
                fontFamily: vars.mono,
                whiteSpace: "nowrap",
              }}
            >
              {body.length} chars
            </span>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              hidden
              onChange={event => {
                if (event.target.files) void uploadFiles(event.target.files);
              }}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              style={{
                ...btnSecondary,
                padding: "0.375rem 0.75rem",
                opacity: uploading ? 0.55 : 1,
                cursor: uploading ? "not-allowed" : "pointer",
              }}
            >
              {uploading ? "Uploading..." : "Upload"}
            </button>
          </div>
        </div>
        <textarea
          ref={textareaRef}
          value={body}
          onChange={e => setBody(e.target.value)}
          onDragOver={event => event.preventDefault()}
          onDrop={handleDrop}
          spellCheck={false}
          className="pe-body"
          style={{
            width: "100%",
            minHeight: "24rem",
            padding: "1rem 1.25rem",
            border: "none",
            outline: "none",
            resize: "vertical",
            background: "transparent",
            color: "var(--foreground)",
            fontSize: "0.875rem",
            lineHeight: 1.7,
            fontFamily: vars.mono,
            boxSizing: "border-box",
            tabSize: 2,
          }}
          placeholder="Write your markdown content here. Drop images or files to upload and insert a Markdown link."
        />
      </div>

      {/* Actions */}
      <div
        style={{
          display: "flex",
          gap: "0.75rem",
          justifyContent: "flex-end",
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        {error && (
          <span
            style={{ fontSize: "0.8125rem", color: "#ef4444", fontWeight: 500 }}
          >
            {error}
          </span>
        )}
        {saved && (
          <span
            style={{ fontSize: "0.8125rem", color: "#16a34a", fontWeight: 500 }}
          >
            Saved
          </span>
        )}
        <a href="/admin" style={btnSecondary}>
          Cancel
        </a>
        <button
          onClick={handleSave}
          disabled={saving || !canSave}
          style={{
            ...btnPrimary,
            opacity: saving || !canSave ? 0.5 : 1,
            cursor: saving || !canSave ? "not-allowed" : "pointer",
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
