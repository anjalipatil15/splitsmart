import type { Person, Expense, Settlement, Balance } from "./types"

// Calculate the net balance for each person
export function calculateBalances(people: Person[], expenses: Expense[]): Balance {
  const balances: Balance = {}

  // Initialize balances to zero
  people.forEach((person) => {
    balances[person.id] = 0
  })

  // Process each expense
  expenses.forEach((expense) => {
    // Each payer gets credit for their contribution
    expense.payers.forEach((payer) => {
      balances[payer.payerId] += payer.amount
    })

    // Each person in the split owes their share
    const splitWith = expense.splitWith
    const shareAmount = expense.amount / splitWith.length
    splitWith.forEach((personId) => {
      balances[personId] -= shareAmount
    })
  })

  return balances
}

// Greedy algorithm to minimize the number of transactions
export function minimizeTransactions(balances: Balance, people: Person[]): Settlement[] {
  const settlements: Settlement[] = []

  // Convert balances to arrays of debtors and creditors
  const debtors: { id: string; amount: number }[] = []
  const creditors: { id: string; amount: number }[] = []

  for (const [personId, amount] of Object.entries(balances)) {
    // Round to 2 decimal places to avoid floating point issues
    const roundedAmount = Math.round(amount * 100) / 100

    if (roundedAmount < -0.01) {
      debtors.push({ id: personId, amount: -roundedAmount })
    } else if (roundedAmount > 0.01) {
      creditors.push({ id: personId, amount: roundedAmount })
    }
  }

  // Sort by amount (descending)
  debtors.sort((a, b) => b.amount - a.amount)
  creditors.sort((a, b) => b.amount - a.amount)

  // Greedy algorithm: match largest debtor with largest creditor
  while (debtors.length > 0 && creditors.length > 0) {
    const debtor = debtors[0]
    const creditor = creditors[0]

    // Find the minimum of what's owed and what's due
    const amount = Math.min(debtor.amount, creditor.amount)

    // Create a settlement
    settlements.push({
      from: debtor.id,
      to: creditor.id,
      amount,
    })

    // Update amounts
    debtor.amount -= amount
    creditor.amount -= amount

    // Remove entries with zero balance
    if (debtor.amount < 0.01) debtors.shift()
    if (creditor.amount < 0.01) creditors.shift()
  }

  // Map IDs to names for better readability
  return settlements.map((settlement) => ({
    ...settlement,
    from: getPersonName(settlement.from, people),
    to: getPersonName(settlement.to, people),
  }))
}

// Helper function to get person name from ID
function getPersonName(id: string, people: Person[]): string {
  const person = people.find((p) => p.id === id)
  return person ? person.name : id
}
