export type APIResponse<T extends Record<any, unknown>> = {
  [K in keyof T]: T[K];
} & {
  message: string;
  code: number;
};
