import type { Expense } from "./types"

// Knapsack algorithm to optimize expense grouping
export function optimizeExpenseGroups(expenses: Expense[], targetAmount: number): Expense[] {
  // Convert amounts to cents to avoid floating point issues
  const targetCents = Math.round(targetAmount * 100)

  // Filter out expenses that are already larger than the target
  const eligibleExpenses = expenses.filter((expense) => expense.amount <= targetAmount)

  if (eligibleExpenses.length === 0) {
    return []
  }

  // Convert expense amounts to cents
  const expenseAmounts = eligibleExpenses.map((expense) => Math.round(expense.amount * 100))

  // Create a table for dynamic programming
  // dp[i][j] = maximum value that can be obtained using first i items and weight <= j
  const n = eligibleExpenses.length
  const dp: number[][] = Array(n + 1)
    .fill(null)
    .map(() => Array(targetCents + 1).fill(0))

  // Keep track of which items are included in the solution
  const included: boolean[][] = Array(n + 1)
    .fill(null)
    .map(() => Array(targetCents + 1).fill(false))

  // Fill the dp table
  for (let i = 1; i <= n; i++) {
    const expenseAmount = expenseAmounts[i - 1]

    for (let j = 0; j <= targetCents; j++) {
      // If this item is too heavy, skip it
      if (expenseAmount > j) {
        dp[i][j] = dp[i - 1][j]
      } else {
        // Choose the better option: include this item or not
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

  // Backtrack to find which expenses to include
  const result: Expense[] = []
  let remainingWeight = targetCents

  for (let i = n; i > 0; i--) {
    // If this item is included in the optimal solution
    if (included[i][remainingWeight]) {
      result.push(eligibleExpenses[i - 1])
      remainingWeight -= expenseAmounts[i - 1]
    }
  }

  return result
}
