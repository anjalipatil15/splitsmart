import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Person, Expense } from "@/lib/types"

interface ExpenseListProps {
  expenses: Expense[]
  people: Person[]
}

export function ExpenseList({ expenses, people }: ExpenseListProps) {
  const getPersonName = (id: string) => {
    const person = people.find((p) => p.id === id)
    return person ? person.name : "Unknown"
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  if (expenses.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Expenses</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground py-8">No expenses yet. Add one to get started!</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Expenses</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {expenses.map((expense) => (
            <div key={expense.id} className="flex items-start justify-between border-b pb-4">
              <div className="space-y-1">
                <h3 className="font-medium">{expense.description}</h3>
                <div className="text-sm text-muted-foreground">
                  {expense.payers.length === 1 ? (
                    <p>
                      {getPersonName(expense.payers[0].payerId)} paid Rs.{expense.amount.toFixed(2)}
                    </p>
                  ) : (
                    <div>
                      <p>Paid by multiple people (Rs.{expense.amount.toFixed(2)}):</p>
                      <ul className="list-disc pl-5 mt-1">
                        {expense.payers.map((payer) => (
                          <li key={payer.payerId}>
                            {getPersonName(payer.payerId)}: Rs.{payer.amount.toFixed(2)}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  Split with: {expense.splitWith.map((id) => getPersonName(id)).join(", ")}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">{formatDate(expense.date)}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
