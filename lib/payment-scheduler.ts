import type { Settlement } from "./types"

export interface ScheduledPayment extends Settlement {
  dueDate: string
  priority: number
}

export function schedulePayments(
  settlements: Settlement[],
  startDate: Date = new Date(),
  maxDaysToComplete = 30,
): ScheduledPayment[] {
  // Assign a priority to each settlement based on amount (higher amount = higher priority)
  const prioritizedSettlements: ScheduledPayment[] = settlements.map((settlement, index) => {
    return {
      ...settlement,
      priority: settlement.amount,
      dueDate: new Date(startDate.getTime()).toISOString(), 
    }
  })

  prioritizedSettlements.sort((a, b) => b.priority - a.priority)

  const timeline: (ScheduledPayment | null)[] = Array(maxDaysToComplete).fill(null)

  for (const payment of prioritizedSettlements) {

    let day = maxDaysToComplete - 1
    while (day >= 0) {
      if (timeline[day] === null) {
        timeline[day] = payment

        const dueDate = new Date(startDate.getTime())
        dueDate.setDate(dueDate.getDate() + day)
        payment.dueDate = dueDate.toISOString()

        break
      }
      day--
    }

    if (day < 0) {
      const firstAvailableDay = timeline.findIndex((slot) => slot === null)
      const assignedDay = firstAvailableDay >= 0 ? firstAvailableDay : 0

      const dueDate = new Date(startDate.getTime())
      dueDate.setDate(dueDate.getDate() + assignedDay)
      payment.dueDate = dueDate.toISOString()

      if (firstAvailableDay >= 0) {
        timeline[firstAvailableDay] = payment
      }
    }
  }

  return prioritizedSettlements.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
}
