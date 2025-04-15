import type { Settlement } from "./types"

export interface ScheduledPayment extends Settlement {
  dueDate: string
  priority: number
}

// Job Sequencing algorithm to schedule payments based on priority and deadlines
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
      dueDate: new Date(startDate.getTime()).toISOString(), // Default due date
    }
  })

  // Sort by priority (highest first)
  prioritizedSettlements.sort((a, b) => b.priority - a.priority)

  // Create a timeline of days
  const timeline: (ScheduledPayment | null)[] = Array(maxDaysToComplete).fill(null)

  // Schedule each payment using job sequencing approach
  for (const payment of prioritizedSettlements) {
    // Try to find the latest possible slot for this payment
    // Higher priority payments get scheduled earlier
    let day = maxDaysToComplete - 1
    while (day >= 0) {
      if (timeline[day] === null) {
        timeline[day] = payment

        // Set the due date for this payment
        const dueDate = new Date(startDate.getTime())
        dueDate.setDate(dueDate.getDate() + day)
        payment.dueDate = dueDate.toISOString()

        break
      }
      day--
    }

    // If no slot was found, assign to the first day (overloading is allowed in real scenarios)
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

  // Return the scheduled payments sorted by due date
  return prioritizedSettlements.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
}
