import http from '@api/http'
import type { Transaction } from '@/types/transaction'
import type { SaleRequest } from '@/types/saleRequest'
import type { SaleResponse } from '@/types/saleResponse'

export const sale = async (requestBody: SaleRequest): Promise<SaleResponse> => {
  const { data } = await http.post('/sale', requestBody)

  return data
}

export const getTransactions = async (): Promise<Transaction[]> => {
  const { data } = await http.get('/transactions')

  return data
}
