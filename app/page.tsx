import { ExpenseDashboard } from "@/components/expense-dashboard"

export default function Home() {
  return (
    <main className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">SplitSmart</h1>
      <ExpenseDashboard />
      <p className="bottom-0 w-full text-center py-2 border-t text-sm">Made by Anjali Patil</p>
    </main>
  )
}
