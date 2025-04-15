import type { Expense } from "./types"

export function optimizeExpenseGroups(expenses: Expense[], targetAmount: number): Expense[] {

  const targetCents = Math.round(targetAmount * 100)

  const eligibleExpenses = expenses.filter((expense) => expense.amount <= targetAmount)

  if (eligibleExpenses.length === 0) {
    return []
  }

  const expenseAmounts = eligibleExpenses.map((expense) => Math.round(expense.amount * 100))

  const n = eligibleExpenses.length
  const dp: number[][] = Array(n + 1)
    .fill(null)
    .map(() => Array(targetCents + 1).fill(0))

  const included: boolean[][] = Array(n + 1)
    .fill(null)
    .map(() => Array(targetCents + 1).fill(false))

  for (let i = 1; i <= n; i++) {
    const expenseAmount = expenseAmounts[i - 1]

    for (let j = 0; j <= targetCents; j++) {

      if (expenseAmount > j) {
        dp[i][j] = dp[i - 1][j]
      } else {

        const includeItem = expenseAmount + dp[i - 1][j - expenseAmount]
        const excludeItem = dp[i - 1][j]

        if (includeItem > excludeItem) {
          dp[i][j] = includeItem
          included[i][j] = true
        } else {
          dp[i][j] = excludeItem
          included[i][j] = false
        }
      }
    }
  }

  const result: Expense[] = []
  let remainingWeight = targetCents

  for (let i = n; i > 0; i--) {

    if (included[i][remainingWeight]) {
      result.push(eligibleExpenses[i - 1])
      remainingWeight -= expenseAmounts[i - 1]
    }
  }

  return result
}
