"use client"

import type React from "react"
import { useState } from "react"
import { Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { SearchResults } from "@/components/search-results"
import { SearchProgress } from "@/components/search-progress"
import { scrapeBusinessData, type SearchResult } from "@/app/actions/scraping"

// Add subscription props to the component
interface SearchFormProps {
  subscription?: {
    plan: "trial" | "pro" | "enterprise"
    status: "active" | "canceled" | "past_due" | "unpaid"
    trialEndsAt: Date
  }
  accountType?: "free" | "paid"
}

export function SearchForm({ subscription, accountType = "free" }: SearchFormProps) {
  const [location, setLocation] = useState("")
  const [category, setCategory] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [results, setResults] = useState<SearchResult[]>([])
  const [hasSearched, setHasSearched] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalResults, setTotalResults] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [searchAttempts, setSearchAttempts] = useState(0)
  const [isSampleData, setIsSampleData] = useState(false)

  // Check if the trial has expired
  const isTrialExpired =
    accountType === "free" &&
    subscription &&
    new Date(subscription.trialEndsAt) < new Date() &&
    subscription.plan === "trial"

  // Handle search with Yelp scraping
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!location || !category) return

    setIsSearching(true)
    setHasSearched(true)
    setCurrentPage(1)
    setError(null)
    setSearchAttempts((prev) => prev + 1)
    setIsSampleData(false)

    try {
      // Call the server action to scrape Yelp data
      const response = await scrapeBusinessData(location, category)

      if (response.success && response.results) {
        setResults(response.results)
        setTotalResults(response.totalResults || response.results.length)
        setIsSampleData(response.isSampleData || false)
        if (response.error) {
          setError(response.error)
        }
      } else {
        setError(response.error || "An error occurred during the search. Please try again.")
        setResults([])
        setTotalResults(0)
      }
    } catch (error: any) {
      console.error("Search error:", error)
      setError("An unexpected error occurred. Please try again.")
      setResults([])
      setTotalResults(0)
    } finally {
      setIsSearching(false)
    }
  }

  // Popular Yelp categories
  const popularCategories = [
    "Restaurants",
    "Coffee & Tea",
    "Bars",
    "Nightlife",
    "Shopping",
    "Beauty & Spas",
    "Hair Salons",
    "Nail Salons",
    "Home Services",
    "Plumbers",
    "Electricians",
    "Contractors",
    "Auto Services",
    "Hotels",
    "Real Estate",
    "Financial Services",
    "Health & Medical",
    "Dentists",
    "Doctors",
    "Fitness",
  ]

  return (
    <div className="space-y-12">
      <div>
        <h2 className="text-xl font-medium text-gray-900 mb-6">Yelp Business Finder</h2>

        <form onSubmit={handleSearch} className="space-y-8">
          <div className="grid gap-8 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="location" className="text-sm text-gray-500">
                Location
              </Label>
              <Input
                id="location"
                placeholder="e.g. New York, London, Singapore, Sydney"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="border-gray-300 focus:border-gray-500 focus:ring-0"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category" className="text-sm text-gray-500">
                Category
              </Label>
              <Input
                id="category"
                placeholder="e.g. Restaurants, Coffee, Plumbers"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="border-gray-300 focus:border-gray-500 focus:ring-0"
                list="category-suggestions"
                required
              />
              <datalist id="category-suggestions">
                {popularCategories.map((cat) => (
                  <option key={cat} value={cat} />
                ))}
              </datalist>
              <p className="text-xs text-gray-500 mt-1">
                Try popular categories like Restaurants, Coffee, Bars, Shopping, Beauty & Spas
              </p>
            </div>
          </div>

          <SearchProgress isSearching={isSearching} />

          {error && !isSearching && !results.length && (
            <div className="bg-red-50 text-red-600 p-3 rounded-md">{error}</div>
          )}

          <button
            type="submit"
            className="w-full py-3 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isSearching}
          >
            {isSearching ? (
              <>
                <Loader2 className="inline-block mr-2 h-4 w-4 animate-spin" />
                Searching Yelp...
              </>
            ) : (
              "Search Yelp"
            )}
          </button>
        </form>
      </div>

      {hasSearched && (
        <SearchResults
          results={results}
          isLoading={isSearching}
          location={location}
          category={category}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          totalResults={totalResults}
          isTrialExpired={isTrialExpired}
          error={error || undefined}
          isSampleData={isSampleData}
        />
      )}

      {/* Suggestions for when no results are found */}
      {hasSearched && !isSearching && results.length === 0 && searchAttempts > 0 && (
        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
          <h3 className="text-lg font-medium text-blue-800 mb-2">Suggestions to improve your search:</h3>
          <ul className="list-disc pl-5 space-y-2 text-blue-700">
            <li>Try a more common category (e.g., use "Restaurants" instead of "Fine Dining")</li>
            <li>Check for spelling errors in your search terms</li>
            <li>Try a larger location (e.g., use "New York" instead of a specific neighborhood)</li>
            <li>Use broader terms (e.g., "Coffee" instead of "Espresso Bar")</li>
            <li>
              For best results, use Yelp's common categories like "Restaurants", "Coffee & Tea", or "Beauty & Spas"
            </li>
          </ul>
        </div>
      )}
    </div>
  )
}

