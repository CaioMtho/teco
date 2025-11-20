export interface ApiResponse<T = any> {
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  count: number
  page: number
  perPage: number
  totalPages: number
}

export interface ApiError {
  error: string
  code?: string
  details?: any
}