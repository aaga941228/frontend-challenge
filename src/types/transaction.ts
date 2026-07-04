import type { Role } from './auth'

export interface Transaction {
  id: number
  email: string
  role: Role
  type: string
  amount: number
  name: string
  card: string
  expirationDate: string
  cvv: string
  approvalNumber: number
  financialReference: number
  status: string
  createdAt: string
}
