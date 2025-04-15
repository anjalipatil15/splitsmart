"use client"

import { useState } from "react"
import { ExpenseForm } from "./expense-form"
import { ExpenseList } from "./expense-list"
import { SettlementView } from "./settlement-view"
import { ExpenseOptimizer } from "./expense-optimizer"
import { PaymentScheduler } from "./payment-scheduler"
import { ExpenseCategorizer } from "./expense-categorizer"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Person, Expense, Settlement } from "@/lib/types"
import { calculateBalances, minimizeTransactions } from "@/lib/debt-minimizer"

export function ExpenseDashboard() {
  const [people, setPeople] = useState<Person[]>([
    { id: "1", name: "Anannya" },
    { id: "2", name: "Trayee" },
    { id: "3", name: "Lakshit" },
  ])

  const [expenses, setExpenses] = useState<Expense[]>([])
  const [settlements, setSettlements] = useState<Settlement[]>([])

  const handleAddExpense = (expense: Expense) => {
    setExpenses([...expenses, expense])

    // Recalculate balances and settlements whenever expenses change
    const balances = calculateBalances(people, [...expenses, expense])
    const newSettlements = minimizeTransactions(balances, people)
    setSettlements(newSettlements)
  }

  const handleAddPerson = (name: string) => {
    const newPerson: Person = {
      id: `${Date.now()}`,
      name,
    }
    setPeople([...people, newPerson])
  }

  return (
    <div className="space-y-8">
      <Tabs defaultValue="expenses">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="expenses">Expenses</TabsTrigger>
          <TabsTrigger value="settle">Settle Up</TabsTrigger>
          <TabsTrigger value="optimize">Optimize</TabsTrigger>
          <TabsTrigger value="schedule">Schedule</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
        </TabsList>
        <TabsContent value="expenses" className="space-y-6">
          <ExpenseForm people={people} onAddExpense={handleAddExpense} onAddPerson={handleAddPerson} />
          <ExpenseList expenses={expenses} people={people} />
        </TabsContent>
        <TabsContent value="settle">
          <SettlementView settlements={settlements} />
        </TabsContent>
        <TabsContent value="optimize">
          <ExpenseOptimizer expenses={expenses} />
        </TabsContent>
        <TabsContent value="schedule">
          <PaymentScheduler settlements={settlements} />
        </TabsContent>
        <TabsContent value="categories">
          <ExpenseCategorizer expenses={expenses} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
