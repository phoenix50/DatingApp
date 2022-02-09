export interface Pagination{
    currentPage: number;
    itemsPerPage: number;
    totalItems: number;
    totalPages: number;
}

export class PaiginatedResult<T>{
    result: T;
    pagination: Pagination;
}