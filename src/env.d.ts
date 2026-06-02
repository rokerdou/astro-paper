import type { Runtime } from "@astrojs/cloudflare";

interface CloudflareEnv {
  DB: D1Database;
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
    batch<T = unknown>(statements: D1PreparedStatement[]): Promise<D1Result<T>[]>;
    exec(query: string): Promise<D1Result>;
  }
}

declare namespace App {
  interface Locals extends Runtime<CloudflareEnv> {}
}

export {};
