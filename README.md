# Yelp-Scraper-SAAS
MERN Stack with tailwind 
## Frontend

- **Framework**: Next.js 13.4.19 (App Router)
- **UI Library**: React 18.2.0
- **Styling**: Tailwind CSS 3.3.3 with custom configuration
- **Component Library**: Custom components with shadcn/ui patterns
- **Icons**: Lucide React


## Backend

- **Server**: Next.js App Router with Server Components and Server Actions
- **API Routes**: Next.js API routes for backend functionality
- **Authentication**: Custom cookie-based authentication system
- **Data Fetching**: Server Actions for data operations


## Database

- **Database**: MongoDB (via mongoose 7.5.0)
- **ORM**: Mongoose for MongoDB object modeling


## Payment Processing

- **Payment Gateway**: Stripe integration for subscription management
- **Webhook Handling**: Custom webhook endpoint for Stripe events


## Data Collection

- **Web Scraping**: Custom Yelp scraper using Cheerio 1.0.0-rc.12
- **HTML Parsing**: Cheerio for HTML manipulation and data extraction


## Deployment & Infrastructure

- **Hosting**: Vercel (based on environment variables)
- **Environment Variables**: Vercel environment variables for configuration


## Additional Libraries

- **Date Handling**: date-fns for date formatting and manipulation
- **Password Hashing**: bcryptjs for secure password storage
- **Form Handling**: Native form handling with Server Actions


## Project Structure

- **App Router**: Modern Next.js file-based routing with app directory
- **Server Components**: Heavy use of React Server Components
- **Client Components**: Client interactivity with 'use client' directives
- **API Routes**: Backend functionality via API routes
- **Server Actions**: Form handling and data mutations
