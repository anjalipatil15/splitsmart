"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { Expense } from "@/lib/types"
import { categorizeExpenses, type ExpenseCategory } from "@/lib/expense-categorizer"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"

interface ExpenseCategorizerProps {
  expenses: Expense[]
}

export function ExpenseCategorizer({ expenses }: ExpenseCategorizerProps) {
  const [categories, setCategories] = useState<ExpenseCategory[]>([])
  const [numCategories, setNumCategories] = useState<number>(3)

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#82CA9D", "#FF6B6B"]

  const handleCategorize = () => {
    const result = categorizeExpenses(expenses, numCategories)
    setCategories(result)
  }

  const chartData = categories.map((category, index) => ({
    name: category.name,
    value: category.totalAmount,
    color: COLORS[index % COLORS.length],
  }))

  return (
    <Card>
      <CardHeader>
        <CardTitle>Expense Categorizer (K-means Clustering)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            This tool uses a K-means clustering algorithm to automatically categorize your expenses based on amount
            patterns.
          </p>

          <div className="space-y-2">
            <div className="flex gap-2">
              <select
                className="flex h-10 flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={numCategories}
                onChange={(e) => setNumCategories(Number(e.target.value))}
              >
                <option value="2">2 categories</option>
                <option value="3">3 categories</option>
                <option value="4">4 categories</option>
                <option value="5">5 categories</option>
              </select>
              <Button onClick={handleCategorize}>Categorize</Button>
            </div>
          </div>

          {categories.length > 0 ? (
            <div className="space-y-4 mt-4">
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `$${Number(value).toFixed(2)}`} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="space-y-3">
                {categories.map((category, index) => (
                  <div key={index} className="border rounded-md p-3">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-medium">{category.name}</h3>
                      <span className="font-bold">${category.totalAmount.toFixed(2)}</span>
                    </div>
                    <ul className="space-y-1">
                      {category.expenses.map((expense) => (
                        <li key={expense.id} className="flex justify-between text-sm text-muted-foreground">
                          <span>{expense.description}</span>
                          <span>${expense.amount.toFixed(2)}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          ) : expenses.length > 0 ? (
            <p className="text-sm text-muted-foreground">Click "Categorize" to group your expenses.</p>
          ) : (
            <p className="text-sm text-muted-foreground">Add some expenses first to use this feature.</p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
