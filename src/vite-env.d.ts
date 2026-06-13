/// <reference types="vite/client" />

type D1Result<T = unknown> = {
  results?: T[];
  success: boolean;
  meta: Record<string, unknown>;
};

type D1PreparedStatement = {
  bind(...values: unknown[]): D1PreparedStatement;
  run<T = unknown>(): Promise<D1Result<T>>;
};

type D1Database = {
  prepare(query: string): D1PreparedStatement;
};

type PagesFunction<Env = Record<string, unknown>> = (context: {
  request: Request;
  env: Env;
  params: Record<string, string | string[]>;
  waitUntil: (promise: Promise<unknown>) => void;
  next: () => Promise<Response>;
  data: Record<string, unknown>;
}) => Response | Promise<Response>;
