"use client"

import { useState } from "react"
import {
  Loader2,
  Copy,
  Check,
  Globe,
  Mail,
  Phone,
  MapPin,
  AlertCircle,
  LockIcon,
  Star,
  ExternalLink,
  Clock,
  Home,
  AlertTriangle,
} from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import type { SearchResult } from "@/app/actions/scraping"

interface SearchResultsProps {
  results: SearchResult[]
  isLoading: boolean
  location: string
  category: string
  currentPage: number
  setCurrentPage: (page: number) => void
  totalResults: number
  isTrialExpired?: boolean
  error?: string
  isSampleData?: boolean
}

export function SearchResults({
  results,
  isLoading,
  location,
  category,
  currentPage,
  setCurrentPage,
  totalResults,
  isTrialExpired = false,
  error,
  isSampleData = false,
}: SearchResultsProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)
  const [contactedIds, setContactedIds] = useState<Set<number>>(new Set())
  const resultsPerPage = 10
  const totalPages = Math.ceil(results.length / resultsPerPage)

  // Get current page results
  const getCurrentPageResults = () => {
    const startIndex = (currentPage - 1) * resultsPerPage
    const endIndex = startIndex + resultsPerPage
    return results.slice(startIndex, endIndex)
  }

  const copyToClipboard = (text: string, index: number) => {
    if (isTrialExpired) return // Prevent copying if trial expired

    navigator.clipboard.writeText(text)
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  const toggleContacted = (index: number) => {
    if (isTrialExpired) return // Prevent toggling if trial expired

    const newContactedIds = new Set(contactedIds)
    if (newContactedIds.has(index)) {
      newContactedIds.delete(index)
    } else {
      newContactedIds.add(index)
    }
    setContactedIds(newContactedIds)
  }

  // Format price range for display
  const formatPriceRange = (priceRange: string | null) => {
    if (!priceRange) return null

    // If it's already $ symbols, return as is
    if (priceRange.match(/^\$+$/)) return priceRange

    // Otherwise try to convert to $ symbols
    const priceNumber = Number.parseInt(priceRange.replace(/[^\d]/g, ""))
    if (!isNaN(priceNumber) && priceNumber > 0 && priceNumber <= 4) {
      return "$".repeat(priceNumber)
    }

    return priceRange
  }

  if (isLoading) {
    return (
      <div className="py-12 flex flex-col items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-red-500 mb-4" />
        <p className="text-lg text-gray-900">
          Searching Yelp for {category} in {location}...
        </p>
      </div>
    )
  }

  if (results.length === 0 && !isLoading) {
    return (
      <div className="py-12 text-center">
        <div className="flex justify-center mb-4">
          <AlertCircle className="h-12 w-12 text-amber-500" />
        </div>
        <p className="text-lg text-gray-900 mb-2">No results found</p>
        <p className="text-sm text-gray-500 mb-6">
          {error || "We couldn't find any businesses matching your search criteria on Yelp."}
        </p>
        <p className="text-sm text-gray-500">Try adjusting your search terms or location for better results.</p>
      </div>
    )
  }

  // Result card view for each result
  const ResultCard = ({ result, index }: { result: SearchResult; index: number }) => {
    const actualIndex = (currentPage - 1) * resultsPerPage + index
    const isContacted = contactedIds.has(actualIndex)
    const formattedPriceRange = formatPriceRange(result.priceRange)

    return (
      <div className={`py-6 border-b border-gray-100 last:border-0 ${isContacted ? "bg-gray-50" : ""} relative`}>
        {/* Blur overlay for expired trials */}
        {isTrialExpired && (
          <div className="absolute inset-0 backdrop-blur-md flex flex-col items-center justify-center z-10 bg-white/30">
            <LockIcon className="h-8 w-8 text-gray-400 mb-2" />
            <p className="text-sm text-gray-600 font-medium mb-3">Your free trial has expired</p>
            <Button asChild className="bg-red-600 hover:bg-red-700">
              <Link href="/subscription/checkout?plan=pro">Upgrade to Pro</Link>
            </Button>
          </div>
        )}

        <div className="flex justify-between items-start mb-3">
          <div className="flex items-start gap-3">
            {result.imageUrl && (
              <div className="w-16 h-16 rounded-md overflow-hidden flex-shrink-0">
                <img
                  src={result.imageUrl || "/placeholder.svg?height=64&width=64"}
                  alt={result.name}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div>
              <div className={`font-medium text-lg ${isContacted ? "text-gray-400" : "text-gray-900"}`}>
                {result.name}
              </div>

              {/* Categories */}
              {result.categories && result.categories.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-1">
                  {result.categories.slice(0, 3).map((category, i) => (
                    <span key={i} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                      {category}
                    </span>
                  ))}
                  {result.categories.length > 3 && (
                    <span className="text-xs text-gray-500">+{result.categories.length - 3} more</span>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Checkbox
              checked={isContacted}
              onCheckedChange={() => toggleContacted(actualIndex)}
              className="border-gray-300"
              disabled={isTrialExpired}
            />
            <button
              onClick={() =>
                copyToClipboard(
                  `${result.name}, ${result.email || "No email"}, ${result.phone || "No phone"}`,
                  actualIndex,
                )
              }
              className={`text-gray-500 hover:text-gray-900 ${isTrialExpired ? "cursor-not-allowed opacity-50" : ""}`}
              disabled={isTrialExpired}
            >
              {copiedIndex === actualIndex ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              <span className="sr-only">Copy contact info</span>
            </button>
          </div>
        </div>

        {/* Rating and reviews */}
        <div className="flex items-center gap-2 mb-3">
          {result.rating && (
            <div className="flex items-center text-amber-500">
              <Star className="h-4 w-4 fill-current" />
              <span className="ml-1 text-sm font-medium">{result.rating}</span>
            </div>
          )}
          {result.reviewCount && <span className="text-sm text-gray-500">({result.reviewCount} reviews)</span>}

          {formattedPriceRange && (
            <div className="flex items-center text-gray-500 ml-2">
              <span className="text-sm">{formattedPriceRange}</span>
            </div>
          )}
        </div>

        <div className="space-y-2 mb-3">
          {result.email && (
            <div className={`text-sm flex items-center gap-1 ${isContacted ? "text-gray-400" : "text-gray-900"}`}>
              <Mail className="h-4 w-4 text-gray-500 shrink-0" />
              <span className="truncate">{result.email}</span>
            </div>
          )}

          {result.phone && (
            <div className={`text-sm flex items-center gap-1 ${isContacted ? "text-gray-400" : "text-gray-900"}`}>
              <Phone className="h-4 w-4 text-gray-500 shrink-0" />
              <span>{result.phone}</span>
            </div>
          )}

          {result.website && (
            <div className={`text-sm flex items-center gap-1 ${isContacted ? "text-gray-400" : "text-gray-900"}`}>
              <Globe className="h-4 w-4 text-gray-500 shrink-0" />
              <a
                href={result.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline truncate"
                onClick={(e) => isTrialExpired && e.preventDefault()}
              >
                {result.website.replace(/^https?:\/\/(www\.)?/, "")}
              </a>
            </div>
          )}

          {result.address && (
            <div className={`text-sm flex items-start gap-1 ${isContacted ? "text-gray-400" : "text-gray-900"}`}>
              <MapPin className="h-4 w-4 text-gray-500 shrink-0 mt-0.5" />
              <span className="line-clamp-2">{result.address}</span>
            </div>
          )}

          {result.neighborhood && (
            <div className={`text-sm flex items-start gap-1 ${isContacted ? "text-gray-400" : "text-gray-900"}`}>
              <Home className="h-4 w-4 text-gray-500 shrink-0 mt-0.5" />
              <span>{result.neighborhood}</span>
            </div>
          )}

          {result.hours && (
            <div className={`text-sm flex items-start gap-1 ${isContacted ? "text-gray-400" : "text-gray-900"}`}>
              <Clock className="h-4 w-4 text-gray-500 shrink-0 mt-0.5" />
              <span className="line-clamp-2">{result.hours}</span>
            </div>
          )}
        </div>

        <div className="text-xs text-gray-500 flex items-center justify-between mt-4">
          <a
            href={result.yelpUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center text-red-500 hover:text-red-700"
            onClick={(e) => isTrialExpired && e.preventDefault()}
          >
            <span className="mr-1">View on Yelp</span>
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-xl font-medium text-gray-900 mb-2">
          Yelp Results <span className="text-gray-500 font-normal">({totalResults})</span>
        </h2>
        <p className="text-sm text-gray-500">
          Showing businesses for {category} in {location}
        </p>

        {isSampleData && (
          <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-md flex items-center">
            <AlertTriangle className="h-5 w-5 text-amber-500 mr-2 shrink-0" />
            <p className="text-sm text-amber-700">
              Note: Showing sample data as we couldn't retrieve actual Yelp results. Try a different search or location.
            </p>
          </div>
        )}
      </div>

      {/* Results list */}
      <div className="mb-8">
        {getCurrentPageResults().map((result, index) => (
          <ResultCard key={index} result={result} index={index} />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 py-4">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1 || isTrialExpired}
            className={`px-3 py-2 text-sm text-gray-500 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            Previous
          </button>

          <div className="flex items-center">
            {Array.from({ length: totalPages }).map((_, i) => {
              // Show limited page numbers for clarity
              if (i === 0 || i === totalPages - 1 || (i >= currentPage - 2 && i <= currentPage + 2)) {
                return (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    disabled={isTrialExpired}
                    className={`w-8 h-8 flex items-center justify-center text-sm rounded-md ${
                      currentPage === i + 1 ? "bg-red-600 text-white" : "text-gray-500 hover:text-gray-900"
                    } ${isTrialExpired ? "cursor-not-allowed" : ""}`}
                  >
                    {i + 1}
                  </button>
                )
              }

              // Show ellipsis for breaks
              if (i === 1 && currentPage > 3) {
                return (
                  <span key="start-ellipsis" className="px-1 text-gray-400">
                    ...
                  </span>
                )
              }

              if (i === totalPages - 2 && currentPage < totalPages - 2) {
                return (
                  <span key="end-ellipsis" className="px-1 text-gray-400">
                    ...
                  </span>
                )
              }

              return null
            })}
          </div>

          <button
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages || isTrialExpired}
            className={`px-3 py-2 text-sm text-gray-500 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            Next
          </button>
        </div>
      )}

      <div className="text-sm text-gray-500 text-center">
        <p>Click the copy icon to copy contact information to clipboard</p>
        <p>Check the box to mark a contact as contacted</p>
      </div>
    </div>
  )
}

