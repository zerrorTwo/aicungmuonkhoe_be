export interface SuccessResponse<T> {
  data: T;
  message: string;
  status: number;
}

export interface Paging {
  total: number;
  page: number;
  limit: number;
}

export interface DataPagination<T> {
  listData: T[];
  paging: Paging;
  message: string;
  status: number;
}
