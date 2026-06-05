import type { APIRoute } from "astro";
import { getUploadsBucket } from "@/utils/cloudflare";
import { slugifyStr } from "@/utils/slugify";

export const prerender = false;

const MAX_UPLOAD_SIZE = 15 * 1024 * 1024;
const ALLOWED_TYPES = new Set([
  "image/avif",
  "image/gif",
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/pdf",
  "text/plain",
  "text/markdown",
  "application/zip",
  "application/x-zip-compressed",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
]);

function extensionFromName(name: string) {
  const match = name.toLowerCase().match(/\.([a-z0-9]{1,12})$/);
  return match ? `.${match[1]}` : "";
}

function safeBaseName(name: string) {
  const withoutExtension = name.replace(/\.[^.]+$/, "");
  return slugifyStr(withoutExtension).slice(0, 80) || "upload";
}

function uploadKey(file: File) {
  const now = new Date();
  const yyyy = String(now.getUTCFullYear());
  const mm = String(now.getUTCMonth() + 1).padStart(2, "0");
  const id = crypto.randomUUID().slice(0, 12);
  return `uploads/${yyyy}/${mm}/${Date.now()}-${id}-${safeBaseName(file.name)}${extensionFromName(file.name)}`;
}

function markdownForFile(name: string, url: string, contentType: string) {
  const label = name.replace(/[\]\n\r]/g, " ").trim() || "file";
  return contentType.startsWith("image/")
    ? `![${label}](${url})`
    : `[${label}](${url})`;
}

function validateFile(file: File): { error: string; status: number } | null {
  if (file.size <= 0) return { error: `${file.name} is empty`, status: 400 };
  if (file.size > MAX_UPLOAD_SIZE) {
    return { error: `${file.name} exceeds 15 MB`, status: 413 };
  }
  if (!ALLOWED_TYPES.has(file.type)) {
    return {
      error: `${file.name} has unsupported type ${file.type || "unknown"}`,
      status: 415,
    };
  }
  return null;
}

export const POST: APIRoute = async ({ request, locals }) => {
  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return Response.json(
      { error: "Expected multipart form data" },
      { status: 400 }
    );
  }

  const files = formData
    .getAll("files")
    .filter((value): value is File => value instanceof File);

  if (files.length === 0) {
    return Response.json({ error: "No files were uploaded" }, { status: 400 });
  }

  if (files.length > 10) {
    return Response.json(
      { error: "Upload at most 10 files at a time" },
      { status: 400 }
    );
  }

  for (const file of files) {
    const validation = validateFile(file);
    if (validation) {
      return Response.json(
        { error: validation.error },
        { status: validation.status }
      );
    }
  }

  const bucket = getUploadsBucket(locals);
  const uploads = [];

  for (const file of files) {
    const key = uploadKey(file);
    const url = `/${key}`;

    await bucket.put(key, file, {
      httpMetadata: {
        contentType: file.type,
        contentDisposition: `inline; filename="${file.name.replace(/"/g, "")}"`,
        cacheControl: "public, max-age=31536000, immutable",
      },
      customMetadata: {
        originalName: file.name,
      },
    });

    uploads.push({
      key,
      url,
      name: file.name,
      size: file.size,
      type: file.type,
      markdown: markdownForFile(file.name, url, file.type),
    });
  }

  return Response.json(
    { uploads },
    { headers: { "Cache-Control": "no-store" } }
  );
};
