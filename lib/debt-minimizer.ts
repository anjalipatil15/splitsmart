import type { Person, Expense, Settlement, Balance } from "./types"

export function calculateBalances(people: Person[], expenses: Expense[]): Balance {
  const balances: Balance = {}

  people.forEach((person) => {  
    balances[person.id] = 0
  })

  expenses.forEach((expense) => {

    expense.payers.forEach((payer) => { 
      balances[payer.payerId] += payer.amount
    })

    const splitWith = expense.splitWith 
    const shareAmount = expense.amount / splitWith.length
    splitWith.forEach((personId) => {
      balances[personId] -= shareAmount
    })
  })

  return balances
} // O(n+m ) forEach loop where n=people and m=expenses

export function minimizeTransactions(balances: Balance, people: Person[]): Settlement[] {
  const settlements: Settlement[] = []

  const debtors: { id: string; amount: number }[] = []
  const creditors: { id: string; amount: number }[] = []

  for (const [personId, amount] of Object.entries(balances)) {  // O(n) for loop

    const roundedAmount = Math.round(amount * 100) / 100

    if (roundedAmount < -0.01) {
      debtors.push({ id: personId, amount: -roundedAmount })
    } else if (roundedAmount > 0.01) {
      creditors.push({ id: personId, amount: roundedAmount })
    }
  }
  // O(n log n) 

  debtors.sort((a, b) => b.amount - a.amount)
  creditors.sort((a, b) => b.amount - a.amount)

  while (debtors.length > 0 && creditors.length > 0) {   //O(n) for the while loop
    const debtor = debtors[0]
    const creditor = creditors[0]

    const amount = Math.min(debtor.amount, creditor.amount)

    settlements.push({
      from: debtor.id,
      to: creditor.id,
      amount,
    })

    debtor.amount -= amount
    creditor.amount -= amount

    if (debtor.amount < 0.01) debtors.shift()
    if (creditor.amount < 0.01) creditors.shift()
  }

  return settlements.map((settlement) => ({
    ...settlement,
    from: getPersonName(settlement.from, people),
    to: getPersonName(settlement.to, people),
  }))
}  

function getPersonName(id: string, people: Person[]): string {
  const person = people.find((p) => p.id === id)
  return person ? person.name : id
}
