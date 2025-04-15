"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Plus, Trash2 } from "lucide-react"
import type { Person, Expense, PayerContribution } from "@/lib/types"

interface ExpenseFormProps {
  people: Person[]
  onAddExpense: (expense: Expense) => void
  onAddPerson: (name: string) => void
}

export function ExpenseForm({ people, onAddExpense, onAddPerson }: ExpenseFormProps) {
  const [description, setDescription] = useState("")
  const [totalAmount, setTotalAmount] = useState("")
  const [payers, setPayers] = useState<PayerContribution[]>([])
  const [splitWith, setSplitWith] = useState<string[]>([])
  const [newPersonName, setNewPersonName] = useState("")
  const [showAddPayer, setShowAddPayer] = useState(false)
  const [newPayerId, setNewPayerId] = useState("")
  const [newPayerAmount, setNewPayerAmount] = useState("")

  // Calculate remaining amount to be allocated
  const allocatedAmount = payers.reduce((sum, payer) => sum + payer.amount, 0)
  const remainingAmount = Math.max(0, Number(totalAmount) - allocatedAmount)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!description || !totalAmount || payers.length === 0 || splitWith.length === 0) {
      return
    }

    // Validate that the allocated amount matches the total
    if (Math.abs(Number(totalAmount) - allocatedAmount) > 0.01) {
      alert("The sum of payer contributions must equal the total amount")
      return
    }

    const expense: Expense = {
      id: `${Date.now()}`,
      description,
      amount: Number.parseFloat(totalAmount),
      payers,
      splitWith,
      date: new Date().toISOString(),
    }

    onAddExpense(expense)

    // Reset form
    setDescription("")
    setTotalAmount("")
    setPayers([])
    setSplitWith([])
    setShowAddPayer(false)
  }

  const handleAddPerson = () => {
    if (newPersonName.trim()) {
      onAddPerson(newPersonName.trim())
      setNewPersonName("")
    }
  }

  const handleSplitWithChange = (personId: string) => {
    setSplitWith((current) =>
      current.includes(personId) ? current.filter((id) => id !== personId) : [...current, personId],
    )
  }

  const handleAddPayer = () => {
    if (!newPayerId || !newPayerAmount || Number(newPayerAmount) <= 0) {
      return
    }

    // Check if this person is already a payer
    if (payers.some((p) => p.payerId === newPayerId)) {
      // Update existing payer amount
      setPayers(payers.map((p) => (p.payerId === newPayerId ? { ...p, amount: p.amount + Number(newPayerAmount) } : p)))
    } else {
      // Add new payer
      setPayers([...payers, { payerId: newPayerId, amount: Number(newPayerAmount) }])
    }

    // Reset payer form
    setNewPayerId("")
    setNewPayerAmount("")
    setShowAddPayer(false)
  }

  const handleRemovePayer = (payerId: string) => {
    setPayers(payers.filter((p) => p.payerId !== payerId))
  }

  const getPersonName = (id: string) => {
    const person = people.find((p) => p.id === id)
    return person ? person.name : "Unknown"
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Expense</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              placeholder="Dinner, Movie tickets, etc."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Total Amount</Label>
            <Input
              id="amount"
              type="number"
              min="0.01"
              step="0.01"
              placeholder="0.00"
              value={totalAmount}
              onChange={(e) => setTotalAmount(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label>Paid by</Label>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    Add Person
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Person</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="personName">Name</Label>
                      <Input
                        id="personName"
                        placeholder="Enter name"
                        value={newPersonName}
                        onChange={(e) => setNewPersonName(e.target.value)}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button onClick={handleAddPerson}>Add</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            {/* List of current payers */}
            <div className="space-y-2 mt-2">
              {payers.length > 0 ? (
                <div className="space-y-2">
                  {payers.map((payer) => (
                    <div key={payer.payerId} className="flex items-center justify-between p-2 border rounded-md">
                      <div>
                        <span className="font-medium">{getPersonName(payer.payerId)}</span>
                        <span className="ml-2">${payer.amount.toFixed(2)}</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemovePayer(payer.payerId)}
                        className="h-8 w-8"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No payers added yet</p>
              )}

              {Number(totalAmount) > 0 && (
                <div className="text-sm">
                  {remainingAmount > 0 ? (
                    <p className="text-amber-500">Remaining to allocate: ${remainingAmount.toFixed(2)}</p>
                  ) : (
                    <p className="text-green-500">All amount allocated</p>
                  )}
                </div>
              )}
            </div>

            {/* Add payer form */}
            {showAddPayer ? (
              <div className="space-y-2 p-3 border rounded-md">
                <div className="space-y-2">
                  <Label htmlFor="payerId">Person</Label>
                  <select
                    id="payerId"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={newPayerId}
                    onChange={(e) => setNewPayerId(e.target.value)}
                    required
                  >
                    <option value="">Select person</option>
                    {people.map((person) => (
                      <option key={person.id} value={person.id}>
                        {person.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="payerAmount">Amount Paid</Label>
                  <Input
                    id="payerAmount"
                    type="number"
                    min="0.01"
                    step="0.01"
                    placeholder={remainingAmount > 0 ? remainingAmount.toFixed(2) : "0.00"}
                    value={newPayerAmount}
                    onChange={(e) => setNewPayerAmount(e.target.value)}
                    required
                  />
                </div>
                <div className="flex gap-2 mt-2">
                  <Button type="button" onClick={handleAddPayer} className="flex-1">
                    Add
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setShowAddPayer(false)} className="flex-1">
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => setShowAddPayer(true)}
                disabled={Number(totalAmount) <= 0}
              >
                <Plus className="mr-2 h-4 w-4" /> Add Payer
              </Button>
            )}
          </div>

          <div className="space-y-2">
            <Label>Split with</Label>
            <div className="grid grid-cols-2 gap-2">
              {people.map((person) => (
                <div key={person.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`person-${person.id}`}
                    checked={splitWith.includes(person.id)}
                    onCheckedChange={() => handleSplitWithChange(person.id)}
                  />
                  <Label htmlFor={`person-${person.id}`}>{person.name}</Label>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button
            type="submit"
            className="w-full"
            disabled={
              !description ||
              !totalAmount ||
              payers.length === 0 ||
              splitWith.length === 0 ||
              Math.abs(Number(totalAmount) - allocatedAmount) > 0.01
            }
          >
            Add Expense
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
