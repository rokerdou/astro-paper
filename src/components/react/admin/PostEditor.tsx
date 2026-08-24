import {
  useRef,
  useState,
  useCallback,
  useEffect,
  type KeyboardEvent,
  type ClipboardEvent,
  type DragEvent,
} from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { slugifyStr } from "@/utils/slugify";
import {
  useCreatePost,
  useTags,
  useUpdatePost,
  type Post,
  type PostTag,
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

type MarkdownAction = "heading" | "code" | "link";

function extensionFromType(type: string) {
  const map: Record<string, string> = {
    "image/avif": "avif",
    "image/gif": "gif",
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
  };
  return map[type] || "png";
}

function clipboardFiles(items: DataTransferItemList) {
  return Array.from(items)
    .filter(item => item.kind === "file")
    .map((item, index) => {
      const file = item.getAsFile();
      if (!file) return null;
      if (!file.type.startsWith("image/")) return file;

      const hasUsefulName =
        file.name &&
        !["image.png", "image.jpg", "image.jpeg"].includes(
          file.name.toLowerCase()
        );
      if (hasUsefulName) return file;

      const extension = extensionFromType(file.type);
      return new File(
        [file],
        `pasted-image-${Date.now()}-${index + 1}.${extension}`,
        {
          type: file.type,
          lastModified: file.lastModified || Date.now(),
        }
      );
    })
    .filter((file): file is File => Boolean(file));
}

function countWords(markdown: string) {
  const cjkMatches = markdown.match(/[\u3400-\u9fff]/g) || [];
  const latinMatches = markdown
    .replace(/[\u3400-\u9fff]/g, " ")
    .trim()
    .match(/[A-Za-z0-9_]+(?:[-'][A-Za-z0-9_]+)*/g);
  return cjkMatches.length + (latinMatches?.length || 0);
}

function normalizeTagName(name: string) {
  return name.trim().replace(/\s+/g, " ").slice(0, 80);
}

function uniqueTagNames(tags: string[]) {
  const seen = new Set<string>();
  const result: string[] = [];

  for (const tag of tags) {
    const normalized = normalizeTagName(tag);
    const key = normalized.toLowerCase();
    if (!normalized || seen.has(key)) continue;
    seen.add(key);
    result.push(normalized);
  }

  return result.slice(0, 30);
}

const responsiveCss = `
@media (max-width: 1260px) {
  .pe-layout { grid-template-columns: 1fr !important; }
  .pe-side { position: static !important; }
}
@media (max-width: 640px) {
  .pe-meta { grid-template-columns: 1fr !important; }
  .pe-cover { grid-template-columns: 1fr !important; }
  .pe-title { font-size: 1.125rem !important; }
  .pe-body { min-height: 16rem !important; }
  .pe-toolbar { flex-direction: column !important; align-items: stretch !important; }
  .pe-toolbar-actions { flex-wrap: wrap !important; }
  .pe-toolbar-meta { justify-content: space-between !important; }
  .pe-tag-shell { min-height: auto !important; }
}
`;

function TagInput({
  value,
  onChange,
  availableTags,
}: {
  value: string[];
  onChange: (tags: string[]) => void;
  availableTags: PostTag[];
}) {
  const [draftTag, setDraftTag] = useState("");
  const normalizedDraft = draftTag.trim().toLowerCase();
  const selected = new Set(value.map(tag => tag.toLowerCase()));
  const suggestions = normalizedDraft
    ? availableTags
        .filter(
          tag =>
            !selected.has(tag.name.toLowerCase()) &&
            tag.name.toLowerCase().includes(normalizedDraft)
        )
        .slice(0, 6)
    : availableTags
        .filter(tag => !selected.has(tag.name.toLowerCase()))
        .sort((a, b) => (b.postCount ?? 0) - (a.postCount ?? 0))
        .slice(0, 6);

  const commitTags = useCallback(
    (raw: string) => {
      const parts = raw
        .split(",")
        .map(part => part.trim())
        .filter(Boolean);
      if (parts.length === 0) return;
      onChange(uniqueTagNames([...value, ...parts]));
      setDraftTag("");
    },
    [onChange, value]
  );

  const removeTag = useCallback(
    (tagName: string) => {
      onChange(
        value.filter(tag => tag.toLowerCase() !== tagName.toLowerCase())
      );
    },
    [onChange, value]
  );

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" || event.key === "," || event.key === "Tab") {
      if (!draftTag.trim()) return;
      event.preventDefault();
      commitTags(draftTag);
      return;
    }

    if (event.key === "Backspace" && !draftTag && value.length > 0) {
      onChange(value.slice(0, -1));
    }
  };

  return (
    <div>
      <div
        className="pe-tag-shell"
        style={{
          ...input,
          minHeight: "2.625rem",
          padding: "0.375rem",
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          gap: "0.375rem",
        }}
      >
        {value.map(tag => (
          <span
            key={tag}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.25rem",
              maxWidth: "100%",
              padding: "0.25rem 0.5rem",
              border: "1px solid var(--border)",
              borderRadius: "9999px",
              background: "var(--muted)",
              color: "var(--foreground)",
              fontFamily: vars.font,
              fontSize: "0.75rem",
              fontWeight: 600,
            }}
          >
            <span
              style={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
              title={tag}
            >
              {tag}
            </span>
            <button
              type="button"
              onClick={() => removeTag(tag)}
              aria-label={`Remove ${tag}`}
              title={`Remove ${tag}`}
              style={{
                border: "none",
                background: "transparent",
                color: "var(--muted-foreground)",
                cursor: "pointer",
                padding: 0,
                fontSize: "0.875rem",
                lineHeight: 1,
              }}
            >
              x
            </button>
          </span>
        ))}
        <input
          value={draftTag}
          onChange={event => setDraftTag(event.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={() => commitTags(draftTag)}
          placeholder={value.length === 0 ? "Type tags, press Enter..." : ""}
          style={{
            flex: "1 1 10rem",
            minWidth: "8rem",
            border: "none",
            outline: "none",
            background: "transparent",
            color: "var(--foreground)",
            fontFamily: vars.font,
            fontSize: "0.875rem",
            lineHeight: 1.5,
          }}
        />
      </div>
      {suggestions.length > 0 && (
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "0.375rem",
            marginTop: "0.5rem",
          }}
        >
          {suggestions.map(tag => (
            <button
              key={tag.id}
              type="button"
              onMouseDown={event => event.preventDefault()}
              onClick={() => commitTags(tag.name)}
              style={{
                ...btnSecondary,
                padding: "0.25rem 0.5rem",
                fontSize: "0.6875rem",
                color: "var(--muted-foreground)",
              }}
              title={`${tag.postCount ?? 0} posts`}
            >
              {tag.name}
              {(tag.postCount ?? 0) > 0 ? ` (${tag.postCount})` : ""}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function PostEditorInner({ post }: { post?: Post }) {
  const isEdit = !!post;
  const createPost = useCreatePost();
  const updatePost = useUpdatePost();
  const { data: availableTags = [] } = useTags();
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
  const [tagNames, setTagNames] = useState(
    uniqueTagNames(post?.tags.map(t => t.name) || [])
  );
  const [body, setBody] = useState(post?.body || "");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState("");
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const wordCount = countWords(body);
  const readingMinutes =
    wordCount === 0 ? 0 : Math.max(1, Math.ceil(wordCount / 300));

  const replaceSelection = useCallback(
    (
      nextText: string,
      options: { selectStart?: number; selectEnd?: number } = {}
    ) => {
      const textarea = textareaRef.current;
      const start = textarea?.selectionStart ?? body.length;
      const end = textarea?.selectionEnd ?? body.length;
      const before = body.slice(0, start);
      const after = body.slice(end);
      const nextBody = `${before}${nextText}${after}`;

      setBody(nextBody);
      requestAnimationFrame(() => {
        textarea?.focus();
        const selectionStart = start + (options.selectStart ?? nextText.length);
        const selectionEnd = start + (options.selectEnd ?? selectionStart);
        textarea?.setSelectionRange(selectionStart, selectionEnd);
      });
    },
    [body]
  );

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
      setUploadStatus(
        `Uploading ${selectedFiles.length} file${selectedFiles.length > 1 ? "s" : ""}...`
      );

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
        setUploadStatus(
          `${selectedFiles.length} file${selectedFiles.length > 1 ? "s" : ""} uploaded and inserted`
        );
      } catch (e) {
        setError(e instanceof Error ? e.message : "Unable to upload files");
        setUploadStatus("");
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

  const handlePaste = useCallback(
    (event: ClipboardEvent<HTMLTextAreaElement>) => {
      const files = clipboardFiles(event.clipboardData.items);
      if (files.length === 0) return;

      event.preventDefault();
      void uploadFiles(files);
    },
    [uploadFiles]
  );

  const applyMarkdownAction = useCallback(
    (action: MarkdownAction) => {
      const textarea = textareaRef.current;
      const start = textarea?.selectionStart ?? body.length;
      const end = textarea?.selectionEnd ?? body.length;
      const selected = body.slice(start, end);

      if (action === "heading") {
        const lineStart = body.lastIndexOf("\n", Math.max(0, start - 1)) + 1;
        const lineEnd = body.indexOf("\n", end);
        const resolvedLineEnd = lineEnd === -1 ? body.length : lineEnd;
        const selectedLines = body.slice(lineStart, resolvedLineEnd);
        const nextLines = selectedLines
          .split("\n")
          .map(line => (line.startsWith("## ") ? line.slice(3) : `## ${line}`))
          .join("\n");
        const nextBody = `${body.slice(0, lineStart)}${nextLines}${body.slice(resolvedLineEnd)}`;

        setBody(nextBody);
        requestAnimationFrame(() => {
          textarea?.focus();
          textarea?.setSelectionRange(lineStart, lineStart + nextLines.length);
        });
        return;
      }

      if (action === "code") {
        const code = selected || "code";
        const snippet = `\n\`\`\`\n${code}\n\`\`\`\n`;
        const selectStart = selected ? snippet.length : 5;
        const selectEnd = selected ? snippet.length : 9;
        replaceSelection(snippet, { selectStart, selectEnd });
        return;
      }

      const labelText = selected || "link text";
      const snippet = `[${labelText}](https://example.com)`;
      const urlStart = labelText.length + 3;
      replaceSelection(snippet, {
        selectStart: urlStart,
        selectEnd: urlStart + "https://example.com".length,
      });
    },
    [body, replaceSelection]
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

    const tags = uniqueTagNames(tagNames);
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
    tagNames,
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

  useEffect(() => {
    const handleShortcut = (event: globalThis.KeyboardEvent) => {
      if (
        !(event.metaKey || event.ctrlKey) ||
        event.key.toLowerCase() !== "s"
      ) {
        return;
      }

      event.preventDefault();
      if (!saving && canSave) void handleSave();
    };

    window.addEventListener("keydown", handleShortcut);
    return () => window.removeEventListener("keydown", handleShortcut);
  }, [canSave, handleSave, saving]);

  return (
    <div
      className="pe-layout"
      style={{
        display: "grid",
        gridTemplateColumns: "minmax(0, 1fr) 22rem",
        gap: "1rem",
        alignItems: "start",
      }}
    >
      <style>{responsiveCss}</style>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          minWidth: 0,
        }}
      >
        <div style={card}>
          <label style={label}>Title</label>
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
              fontSize: "1.375rem",
              fontWeight: 800,
              padding: "0.25rem 0",
              letterSpacing: "0",
              background: "transparent",
            }}
          />
        </div>

        <div style={card}>
          <label style={label}>SEO Description</label>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Brief description..."
            rows={3}
            style={{ ...input, minHeight: "6rem", resize: "vertical" }}
          />
        </div>

        {/* Markdown editor */}
        <div
          style={{
            ...card,
            padding: 0,
            overflow: "hidden",
            minHeight: "32rem",
          }}
        >
          <div
            className="pe-toolbar"
            style={{
              padding: "0.625rem 1.25rem",
              borderBottom: "1px solid var(--border)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "0.875rem",
            }}
          >
            <div
              className="pe-toolbar-actions"
              style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
            >
              {(
                [
                  ["heading", "H2"],
                  ["code", "Code"],
                  ["link", "Link"],
                ] as const
              ).map(([action, text]) => (
                <button
                  key={action}
                  type="button"
                  onClick={() => applyMarkdownAction(action)}
                  style={{
                    ...btnSecondary,
                    minWidth: action === "heading" ? "2.75rem" : "auto",
                    padding: "0.375rem 0.625rem",
                    fontFamily: action === "heading" ? vars.font : vars.mono,
                    fontWeight: action === "heading" ? 700 : 600,
                  }}
                  aria-label={`Insert ${text}`}
                  title={`Insert ${text}`}
                >
                  {text}
                </button>
              ))}
            </div>
            <div
              className="pe-toolbar-meta"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
                gap: "0.75rem",
                minWidth: 0,
                flexWrap: "wrap",
              }}
            >
              <span
                style={{
                  fontSize: "0.6875rem",
                  color: "var(--muted-foreground)",
                  fontFamily: vars.mono,
                  whiteSpace: "nowrap",
                }}
              >
                {wordCount} words · {body.length} chars · {readingMinutes} min
              </span>
              {(uploading || uploadStatus) && (
                <span
                  aria-live="polite"
                  style={{
                    fontSize: "0.6875rem",
                    color: uploading ? "var(--accent)" : "#16a34a",
                    fontFamily: vars.font,
                    fontWeight: 600,
                    whiteSpace: "nowrap",
                  }}
                >
                  {uploading
                    ? uploadStatus || "Uploading files..."
                    : uploadStatus}
                </span>
              )}
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
            onPaste={handlePaste}
            onDragOver={event => event.preventDefault()}
            onDrop={handleDrop}
            spellCheck={false}
            className="pe-body"
            style={{
              width: "100%",
              minHeight: "32rem",
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
            placeholder="Write your markdown content here. Paste or drop images/files to upload and insert a Markdown link."
          />
        </div>
      </div>

      <div
        className="pe-side"
        style={{
          position: "sticky",
          top: "1.25rem",
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          minWidth: 0,
        }}
      >
        <div
          style={{
            ...card,
            display: "flex",
            flexDirection: "column",
            gap: "0.875rem",
          }}
        >
          <div>
            <h2
              style={{
                margin: 0,
                color: "var(--foreground)",
                fontFamily: vars.font,
                fontSize: "0.9375rem",
                fontWeight: 800,
              }}
            >
              Publish
            </h2>
            <p
              style={{
                margin: "0.25rem 0 0",
                color: "var(--muted-foreground)",
                fontFamily: vars.font,
                fontSize: "0.75rem",
                lineHeight: 1.45,
              }}
            >
              Cmd/Ctrl+S also saves this post.
            </p>
          </div>
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
          {(error || saved) && (
            <div
              role={error ? "alert" : "status"}
              style={{
                padding: "0.625rem 0.75rem",
                borderRadius: "0.625rem",
                background: error
                  ? "rgba(239,68,68,0.08)"
                  : "rgba(22,163,74,0.08)",
                color: error ? "#ef4444" : "#16a34a",
                fontFamily: vars.font,
                fontSize: "0.8125rem",
                fontWeight: 600,
              }}
            >
              {error || "Saved"}
            </div>
          )}
          <button
            onClick={handleSave}
            disabled={saving || !canSave}
            style={{
              ...btnPrimary,
              width: "100%",
              opacity: saving || !canSave ? 0.5 : 1,
              cursor: saving || !canSave ? "not-allowed" : "pointer",
            }}
          >
            {saving ? "Saving..." : isEdit ? "Update Post" : "Publish Post"}
          </button>
          <a
            href="/admin"
            style={{
              ...btnSecondary,
              width: "100%",
            }}
          >
            Cancel
          </a>
        </div>

        <div style={card}>
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
                marginTop: "0.5rem",
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

        <div style={card}>
          <label style={label}>Author</label>
          <input
            style={input}
            value={author}
            onChange={e => setAuthor(e.target.value)}
            placeholder="Author name"
          />
        </div>

        <div style={card}>
          <label style={label}>Tags</label>
          <TagInput
            value={tagNames}
            onChange={setTagNames}
            availableTags={availableTags}
          />
        </div>

        <div style={card}>
          <label style={label}>Cover Image URL</label>
          <input
            style={input}
            value={coverImage}
            onChange={e => setCoverImage(e.target.value)}
            placeholder="https://..."
          />
        </div>
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
