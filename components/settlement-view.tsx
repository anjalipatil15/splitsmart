import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Settlement } from "@/lib/types"
import { ArrowRight } from "lucide-react"

interface SettlementViewProps {
  settlements: Settlement[]
}

export function SettlementView({ settlements }: SettlementViewProps) {
  if (settlements.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Settlements</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground py-8">No settlements needed. Everyone is square!</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Optimized Settlements</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {settlements.map((settlement, index) => (
            <div key={index} className="flex items-center justify-between border-b pb-4">
              <div className="flex items-center gap-2">
                <span className="font-medium">{settlement.from}</span>
                <ArrowRight className="h-4 w-4" />
                <span className="font-medium">{settlement.to}</span>
              </div>
              <div className="font-medium">${settlement.amount.toFixed(2)}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
