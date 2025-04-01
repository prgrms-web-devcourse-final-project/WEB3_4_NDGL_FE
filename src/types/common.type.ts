export type APIResponse<T = unknown> = {
  data: T;
  message: string;
  code: number;
};
