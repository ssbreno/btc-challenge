export type Pagination<T> = {
  data: T[]
  count: number
  totalPages: number
  actualPage: number
}
