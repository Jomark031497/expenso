export type AppError = {
  message: string;
  errors: Record<string, unknown>;
};

export type RequestQueryOptions = {
  pageSize?: number;
  page?: number;
};

export type PaginationState = {
  pageSize: number;
  page: number;
};
