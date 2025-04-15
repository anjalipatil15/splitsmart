"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import type { Settlement } from "@/lib/types"
import { schedulePayments, type ScheduledPayment } from "@/lib/payment-scheduler"
import { ArrowRight, CalendarIcon } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"

interface PaymentSchedulerProps {
  settlements: Settlement[]
}

export function PaymentScheduler({ settlements }: PaymentSchedulerProps) {
  const [startDate, setStartDate] = useState<Date>(new Date())
  const [maxDays, setMaxDays] = useState<number>(14)
  const [scheduledPayments, setScheduledPayments] = useState<ScheduledPayment[]>([])
  const [open, setOpen] = useState(false)

  const handleSchedule = () => {
    const result = schedulePayments(settlements, startDate, maxDays)
    setScheduledPayments(result)
  }

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "MMM d, yyyy")
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Scheduler</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Create a payment schedule based on payment amounts and
            deadlines.
          </p>

          <div className="space-y-2">
            <div className="flex flex-col space-y-2 sm:flex-row sm:space-x-2 sm:space-y-0">
              <div className="space-y-1 flex-1">
                <label className="text-sm font-medium">Start Date</label>
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {format(startDate, "PPP")}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={startDate}
                      onSelect={(date) => {
                        if (date) {
                          setStartDate(date)
                          setOpen(false)
                        }
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-1 flex-1">
                <label className="text-sm font-medium">Days to Complete</label>
                <select
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={maxDays}
                  onChange={(e) => setMaxDays(Number(e.target.value))}
                >
                  <option value="7">7 days</option>
                  <option value="14">14 days</option>
                  <option value="30">30 days</option>
                </select>
              </div>
            </div>

            <Button onClick={handleSchedule} className="w-full">
              Schedule Payments
            </Button>
          </div>

          {scheduledPayments.length > 0 ? (
            <div className="space-y-2 mt-4">
              <h3 className="font-medium">Payment Schedule</h3>
              <ul className="space-y-3">
                {scheduledPayments.map((payment, index) => (
                  <li key={index} className="border rounded-md p-3">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-medium">Due: {formatDate(payment.dueDate)}</span>
                      <span className="font-bold">Rs.{payment.amount.toFixed(2)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>{payment.from}</span>
                      <ArrowRight className="h-3 w-3" />
                      <span>{payment.to}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ) : settlements.length > 0 ? (
            <p className="text-sm text-muted-foreground">Click "Schedule Payments" to create a payment plan.</p>
          ) : (
            <p className="text-sm text-muted-foreground">Add some expenses first to generate settlements.</p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
