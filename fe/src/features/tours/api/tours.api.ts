import { axiosInstance } from '@/lib/axios'
import type { Page, Tour } from '@/lib/types'
import { getMockToursPage, getMockTourById } from '@/lib/mockData'

interface GetToursParams {
  keyword?: string
  regionId?: number
  provinceId?: number
  status?: string
  page?: number
  size?: number
}

// Set to true to use mock data, false to use real API
const USE_MOCK_DATA = true

export const toursApi = {
  getTours: async (params: GetToursParams = {}): Promise<Page<Tour>> => {
    if (USE_MOCK_DATA) {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500))
      return getMockToursPage(params.page ?? 0, params.size ?? 12, params.keyword ?? '')
    }
    


    const response = await axiosInstance.get<Page<Tour>>('/api/tours/tours', {
      params: {
        ...params,
        page: params.page ?? 0,
        size: params.size ?? 12,
      },
    })
    return response.data
  },

  getTourById: async (id: string): Promise<Tour> => {
    if (USE_MOCK_DATA) {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300))
      const tour = getMockTourById(id)
      if (!tour) {
        throw new Error('Tour not found')
      }
      return tour
    }
    
    const response = await axiosInstance.get<Tour>(`/api/tours/tours/${id}`)
    return response.data
  },
}

