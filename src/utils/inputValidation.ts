export class InputValidationError extends Error {}

export function optionalString(
  value: unknown,
  field: string,
  maxLength: number,
  options: { nullable?: boolean } = {}
) {
  if (value === undefined) return undefined;
  if (value === null && options.nullable) return null;
  if (typeof value !== "string") {
    throw new InputValidationError(`${field} must be a string`);
  }
  const normalized = value.trim();
  if (normalized.length > maxLength) {
    throw new InputValidationError(`${field} is too long`);
  }
  return normalized;
}

export function requiredString(
  value: unknown,
  field: string,
  maxLength: number
) {
  const normalized = optionalString(value, field, maxLength);
  if (!normalized) throw new InputValidationError(`${field} is required`);
  return normalized;
}

export function optionalBoolean(value: unknown, field: string) {
  if (value === undefined) return undefined;
  if (typeof value !== "boolean") {
    throw new InputValidationError(`${field} must be a boolean`);
  }
  return value;
}

export function optionalIsoDate(value: unknown, field: string) {
  if (value === undefined || value === null || value === "")
    return value === undefined ? undefined : null;
  if (typeof value !== "string" || Number.isNaN(Date.parse(value))) {
    throw new InputValidationError(`${field} must be a valid date`);
  }
  return new Date(value).toISOString();
}

export function optionalWebUrl(value: unknown, field: string) {
  const normalized = optionalString(value, field, 2048, { nullable: true });
  if (!normalized) return normalized ?? null;
  if (normalized.startsWith("/")) return normalized;
  try {
    const url = new URL(normalized);
    if (url.protocol !== "http:" && url.protocol !== "https:")
      throw new Error();
    return url.href;
  } catch {
    throw new InputValidationError(
      `${field} must be an HTTP(S) URL or root-relative path`
    );
  }
}

export function parseTags(value: unknown) {
  if (value === undefined) return undefined;
  if (!Array.isArray(value) || value.some(tag => typeof tag !== "string")) {
    throw new InputValidationError("Tags must be an array of strings");
  }
  return [...new Set(value.map(tag => tag.trim()).filter(Boolean))].slice(
    0,
    30
  );
}

export function parseJsonObject(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new InputValidationError("JSON body must be an object");
  }
  return value as Record<string, unknown>;
}
