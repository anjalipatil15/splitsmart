import type { Expense } from "./types"

export interface ExpenseCategory {
  name: string
  expenses: Expense[]
  totalAmount: number
}

// K-means clustering algorithm to automatically categorize expenses
export function categorizeExpenses(expenses: Expense[], k = 3): ExpenseCategory[] {
  if (expenses.length === 0) return []
  if (expenses.length <= k) {
    // If we have fewer expenses than categories, each expense gets its own category
    return expenses.map((expense) => ({
      name: expense.description,
      expenses: [expense],
      totalAmount: expense.amount,
    }))
  }

  // Feature extraction: convert expenses to numerical features
  // For simplicity, we'll just use the amount as the feature
  const features = expenses.map((expense) => expense.amount)

  // Initialize k centroids randomly
  const centroids: number[] = []
  const min = Math.min(...features)
  const max = Math.max(...features)

  for (let i = 0; i < k; i++) {
    centroids.push(min + ((max - min) * i) / (k - 1))
  }

  // Maximum iterations to prevent infinite loops
  const maxIterations = 100
  let iterations = 0
  let previousCentroids: number[] = []

  // Main k-means loop
  while (iterations < maxIterations) {
    // Assign each expense to the nearest centroid
    const clusters: number[][] = Array(k)
      .fill(null)
      .map(() => [])

    features.forEach((feature, index) => {
      let minDistance = Number.POSITIVE_INFINITY
      let closestCentroid = 0

      centroids.forEach((centroid, centroidIndex) => {
        const distance = Math.abs(feature - centroid)
        if (distance < minDistance) {
          minDistance = distance
          closestCentroid = centroidIndex
        }
      })

      clusters[closestCentroid].push(index)
    })

    // Store current centroids for convergence check
    previousCentroids = [...centroids]

    // Update centroids based on the mean of each cluster
    for (let i = 0; i < k; i++) {
      if (clusters[i].length > 0) {
        const clusterFeatures = clusters[i].map((index) => features[index])
        centroids[i] = clusterFeatures.reduce((sum, val) => sum + val, 0) / clusterFeatures.length
      }
    }

    // Check for convergence
    const hasConverged = centroids.every((centroid, i) => Math.abs(centroid - previousCentroids[i]) < 0.01)
    if (hasConverged) break

    iterations++
  }

  // Assign expenses to final clusters
  const finalClusters: Expense[][] = Array(k)
    .fill(null)
    .map(() => [])

  features.forEach((feature, index) => {
    let minDistance = Number.POSITIVE_INFINITY
    let closestCentroid = 0

    centroids.forEach((centroid, centroidIndex) => {
      const distance = Math.abs(feature - centroid)
      if (distance < minDistance) {
        minDistance = distance
        closestCentroid = centroidIndex
      }
    })

    finalClusters[closestCentroid].push(expenses[index])
  })

  // Create category names based on the most common words in the descriptions
  return finalClusters
    .filter((cluster) => cluster.length > 0)
    .map((cluster) => {
      // Find the most common word in the descriptions
      const words = cluster
        .flatMap((expense) => expense.description.toLowerCase().split(/\s+/))
        .filter((word) => word.length > 3)

      const wordCounts: Record<string, number> = {}
      words.forEach((word) => {
        wordCounts[word] = (wordCounts[word] || 0) + 1
      })

      let categoryName = "Miscellaneous"
      let maxCount = 0

      Object.entries(wordCounts).forEach(([word, count]) => {
        if (count > maxCount) {
          maxCount = count
          categoryName = word.charAt(0).toUpperCase() + word.slice(1)
        }
      })

      const totalAmount = cluster.reduce((sum, expense) => sum + expense.amount, 0)

      return {
        name: categoryName,
        expenses: cluster,
        totalAmount,
      }
    })
}
