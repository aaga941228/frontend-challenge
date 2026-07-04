import http from '@api/http'
import type { Transaction } from '@/types/transaction'
import type { SaleRequest } from '@/types/saleRequest'
import type { SaleResponse } from '@/types/saleResponse'
import type { TransactionRequest } from '@/types/transactionRequest'

export const sale = async (requestBody: SaleRequest): Promise<SaleResponse> => {
  const { data } = await http.post('/sale', requestBody)

  return data
}

export const getTransactions = async (): Promise<Transaction[]> => {
  const { data } = await http.get('/transactions')

  return data
}

export const processTransaction = async (transaction: TransactionRequest): Promise<unknown> => {
  const { data } = await http.patch('/transactions', transaction)

  return data
}
