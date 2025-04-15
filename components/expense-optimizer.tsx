"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import type { Expense } from "@/lib/types"
import { optimizeExpenseGroups } from "@/lib/expense-optimizer"

interface ExpenseOptimizerProps {
  expenses: Expense[]
}

export function ExpenseOptimizer({ expenses }: ExpenseOptimizerProps) {
  const [targetAmount, setTargetAmount] = useState<number>(100)
  const [optimizedExpenses, setOptimizedExpenses] = useState<Expense[]>([])
  const [totalOptimized, setTotalOptimized] = useState<number>(0)
  const [error, setError] = useState<string>("")

  const handleOptimize = () => {
    if (!targetAmount || targetAmount <= 0) {
      setError("Please enter a valid target amount")
      return
    }

    setError("")

    // Filter expenses that are eligible (not greater than target amount)
    const eligibleExpenses = expenses.filter((expense) => expense.amount <= targetAmount)

    if (eligibleExpenses.length === 0) {
      setError("No eligible expenses found. All expenses are larger than the target amount.")
      setOptimizedExpenses([])
      setTotalOptimized(0)
      return
    }

    const result = optimizeExpenseGroups(expenses, targetAmount)
    setOptimizedExpenses(result)
    setTotalOptimized(result.reduce((sum, expense) => sum + expense.amount, 0))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Expense Optimizer (Knapsack Algorithm)</CardTitle>
        <CardDescription>
          Find the optimal combination of expenses that add up closest to your target amount without exceeding it
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          This tool uses the Knapsack algorithm to find the optimal combination of expenses that add up closest to your
          target amount without exceeding it.
        </p>

        <div className="space-y-2">
          <Label htmlFor="targetAmount">Target Amount ($)</Label>
          <div className="flex gap-2">
            <Input
              id="targetAmount"
              type="number"
              min="1"
              step="0.01"
              value={targetAmount}
              onChange={(e) => setTargetAmount(Number(e.target.value))}
            />
            <Button onClick={handleOptimize}>Optimize</Button>
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
        </div>

        {optimizedExpenses.length > 0 ? (
          <div className="space-y-2 mt-4">
            <h3 className="font-medium">Optimized Expense Group: ${totalOptimized.toFixed(2)}</h3>
            <p className="text-sm text-muted-foreground">
              Target: ${targetAmount.toFixed(2)} | Difference: ${Math.abs(targetAmount - totalOptimized).toFixed(2)}
            </p>
            <ul className="space-y-2 mt-4">
              {optimizedExpenses.map((expense) => (
                <li key={expense.id} className="flex justify-between border-b pb-2">
                  <span>{expense.description}</span>
                  <span>${expense.amount.toFixed(2)}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : expenses.length > 0 ? (
          <p className="text-sm text-muted-foreground">Click "Optimize" to find the best combination of expenses.</p>
        ) : (
          <p className="text-sm text-muted-foreground">Add some expenses first to use this feature.</p>
        )}
      </CardContent>
    </Card>
  )
}
