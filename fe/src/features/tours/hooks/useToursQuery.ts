import { useQuery } from '@tanstack/react-query'
import { toursApi } from '../api/tours.api'

interface UseToursQueryParams {
  keyword?: string
  regionId?: number
  provinceId?: number
  status?: string
  page?: number
  size?: number
}

export function useToursQuery(params: UseToursQueryParams = {}) {
  return useQuery({
    queryKey: ['tours', params],
    queryFn: () => toursApi.getTours(params),
  })
}

