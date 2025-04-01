"use client"

import { useState, useEffect } from "react"

interface SearchProgressProps {
  isSearching: boolean
}

export function SearchProgress({ isSearching }: SearchProgressProps) {
  const [progress, setProgress] = useState(0)
  const [currentStep, setCurrentStep] = useState(1)
  const totalSteps = 3

  const steps = ["Searching Yelp", "Extracting business details", "Processing results"]

  useEffect(() => {
    if (!isSearching) {
      setProgress(0)
      setCurrentStep(1)
      return
    }

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          // Move to next step
          setCurrentStep((currentStep) => {
            const nextStep = currentStep + 1
            if (nextStep > totalSteps) {
              clearInterval(interval)
              return totalSteps
            }
            return nextStep
          })
          return 0
        }

        // Slow down progress as we get closer to 100%
        const increment = 100 - prev < 30 ? Math.random() * 5 : Math.random() * 15
        return prev + increment
      })
    }, 300)

    return () => clearInterval(interval)
  }, [isSearching])

  if (!isSearching) return null

  return (
    <div className="w-full mt-4">
      <div className="flex justify-between mb-2 text-xs text-gray-500">
        <span>{steps[currentStep - 1]}</span>
        <span>{Math.min(Math.round(progress), 100)}%</span>
      </div>
      <div className="h-0.5 w-full bg-gray-100 overflow-hidden">
        <div
          className="h-full bg-red-600 transition-all duration-300 ease-out"
          style={{ width: `${Math.min(progress, 100)}%` }}
        />
      </div>
    </div>
  )
}

