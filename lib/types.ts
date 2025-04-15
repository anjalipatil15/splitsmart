export interface Person {
  id: string
  name: string
}

export interface PayerContribution {
  payerId: string
  amount: number
}

export interface Expense {
  id: string
  description: string
  amount: number
  payers: PayerContribution[] // Changed from single paidBy to multiple payers
  splitWith: string[]
  date: string
}

export interface Settlement {
  from: string
  to: string
  amount: number
}

export interface Balance {
  [personId: string]: number
}
