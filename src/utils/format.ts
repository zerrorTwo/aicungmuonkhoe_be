export class SuccessResponse<T = any> {
  data: T;
  message: string;
  status: number;
}
export class SuccessPaginationResponse {
  data: DataPagination;
  message: string;
  status: number;
}

export class DataPagination {
  listData: any[];
  paging: {
    curPage: number;
    limitPage: number;
    totalRows: number;
    totalPage: number;
  };
  message: string;
  status: number;
}

export class DataPaginationHaveTimer {
  listData: any[];
  timeSliderBanner: string;
  paging: {
    curPage: number;
    limitPage: number;
    totalRows: number;
    totalPage: number;
  };
}
