"use server"

import { revalidatePath } from "next/cache"
import { searchYelpBusinesses, type YelpBusinessResult } from "@/lib/yelp-scraper"

// Define the result type for the frontend - same as YelpBusinessResult
export type SearchResult = YelpBusinessResult

export async function scrapeBusinessData(
  location: string,
  category: string,
): Promise<{
  success: boolean
  results?: SearchResult[]
  error?: string
  totalResults?: number
  isSampleData?: boolean
}> {
  try {
    // Validate inputs
    if (!location || !category) {
      return {
        success: false,
        error: "Location and category are required",
      }
    }

    console.log(`Starting Yelp scrape for ${category} in ${location}`)

    // Use the Yelp scraper to get business data
    const yelpResults = await searchYelpBusinesses(location, category, 3)

    // If we got results, return them
    if (yelpResults.length > 0) {
      console.log(`Found ${yelpResults.length} Yelp results`)

      // Check if these are sample results (all sample results have placeholder images)
      const isSampleData = yelpResults.every((result) => result.imageUrl?.includes("/placeholder.svg"))

      // Revalidate the dashboard path to update UI
      revalidatePath("/dashboard")

      return {
        success: true,
        results: yelpResults,
        totalResults: yelpResults.length,
        isSampleData: isSampleData,
      }
    } else {
      // No results found
      return {
        success: false,
        error:
          "No businesses found on Yelp matching your search criteria. Try adjusting your search terms or location.",
        results: [],
        totalResults: 0,
      }
    }
  } catch (error: any) {
    console.error("Yelp scraping action error:", error)

    // Provide more detailed error information
    const errorMessage = error.message || "Unknown error"
    console.error("Detailed Yelp scraping error:", {
      error: errorMessage,
      stack: error.stack,
      location,
      category,
    })

    return {
      success: false,
      error: "An error occurred while searching Yelp. Please try again later.",
      results: [],
      totalResults: 0,
    }
  }
}

