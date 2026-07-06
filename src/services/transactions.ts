import http from '@api/http'
import type { Transaction } from '@/types/transaction'
import type { SaleRequest } from '@/types/saleRequest'
import type { SaleResponse } from '@/types/saleResponse'
import type { TransactionRequest } from '@/types/transactionRequest'
import type { AxiosResponse } from 'axios'

export const sale = (requestBody: SaleRequest): Promise<AxiosResponse<SaleResponse>> => {
  return http.post('/sale', requestBody)
}

export const getTransactions = (): Promise<AxiosResponse<Transaction[]>> => {
  return http.get('/transactions')
}

export const processTransaction = (transaction: TransactionRequest): Promise<unknown> => {
  return http.patch('/transaction', transaction)
}
