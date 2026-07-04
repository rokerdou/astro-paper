import type { Runtime } from "@astrojs/cloudflare";

interface CloudflareEnv {
  DB: D1Database;
  UPLOADS: R2Bucket;
  ADMIN_USERNAME?: string;
  ADMIN_PASSWORD?: string;
  COMMENT_HASH_SECRET?: string;
}

declare global {
  interface D1Result<T = unknown> {
    results?: T[];
    success: boolean;
    error?: string;
    meta?: Record<string, unknown>;
  }

  interface D1PreparedStatement {
    bind(...values: unknown[]): D1PreparedStatement;
    first<T = unknown>(): Promise<T | null>;
    all<T = unknown>(): Promise<D1Result<T>>;
    run(): Promise<D1Result>;
  }

  interface D1Database {
    prepare(query: string): D1PreparedStatement;
    batch<T = unknown>(
      statements: D1PreparedStatement[]
    ): Promise<D1Result<T>[]>;
    exec(query: string): Promise<D1Result>;
  }

  interface R2ObjectBody {
    body: ReadableStream;
    httpMetadata?: {
      contentType?: string;
      contentDisposition?: string;
      cacheControl?: string;
    };
    writeHttpMetadata(headers: Headers): void;
  }

  interface R2PutOptions {
    httpMetadata?: {
      contentType?: string;
      contentDisposition?: string;
      cacheControl?: string;
    };
    customMetadata?: Record<string, string>;
  }

  interface R2Bucket {
    get(key: string): Promise<R2ObjectBody | null>;
    put(
      key: string,
      value: ReadableStream | ArrayBuffer | ArrayBufferView | string | Blob,
      options?: R2PutOptions
    ): Promise<unknown>;
  }
}

/* eslint-disable @typescript-eslint/no-empty-object-type, @typescript-eslint/no-unused-vars */
declare namespace App {
  interface Locals extends Runtime<CloudflareEnv> {}
}
/* eslint-enable @typescript-eslint/no-empty-object-type, @typescript-eslint/no-unused-vars */

export {};
