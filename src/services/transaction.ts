import http from '@api/http'
import type { SaleRequest } from '@/types/saleRequest'
import type { SaleResponse } from '@/types/saleResponse'

export const sale = async (requestBody: SaleRequest): Promise<SaleResponse> => {
  const { data } = await http.post('/sale', requestBody)

  return data
}
