import Link from "next/link"
import { ArrowRight } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Header */}
      <header className="py-6 border-b border-blue-100 bg-white/90 backdrop-blur-sm fixed top-0 left-0 right-0 z-50">
        <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-lg font-bold tracking-tight text-blue-600 font-heading">ARCX Marketing</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <Link href="/about" className="text-sm text-blue-600 hover:text-blue-800 transition-colors">
              About
            </Link>
            <Link href="/pricing" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
              Pricing
            </Link>
            <Link href="/login" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
              Login
            </Link>
            <Link
              href="/login?tab=register"
              className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors font-medium"
            >
              Sign Up
            </Link>
          </nav>

          <div className="md:hidden">
            <Link href="/login" className="text-sm text-blue-600 hover:text-blue-800 transition-colors font-medium">
              Login
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 md:pt-40 md:pb-32 bg-gradient-to-b from-blue-50 to-white">
        <div className="container mx-auto px-4 md:px-6 max-w-6xl">
          <h1 className="text-4xl md:text-5xl font-bold text-blue-950 leading-tight mb-6 md:mb-8 font-heading text-center">
            Our Story
          </h1>
          <p className="text-xl text-blue-800/80 max-w-3xl mx-auto mb-10 md:mb-12 leading-relaxed text-center">
            From marketing agency to software company - built by marketers, for marketers
          </p>
        </div>
      </section>

      {/* Our Journey Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-blue-950 mb-6">How It All Started</h2>
              <p className="text-gray-700 mb-4">
                ARCX began as a small marketing agency in 2018, focused on helping local businesses grow their online
                presence. As we expanded our client base, we faced a common challenge: finding qualified leads
                efficiently.
              </p>
              <p className="text-gray-700 mb-4">
                Frustrated with the existing tools on the market, our team of marketers and developers decided to build
                our own internal solution to streamline our lead generation process.
              </p>
              <p className="text-gray-700">
                What started as an internal tool quickly became our most valuable asset, allowing us to scale our agency
                operations and deliver better results for our clients.
              </p>
            </div>
            <div className="rounded-lg overflow-hidden shadow-xl">
              <img
                src="/placeholder.svg?height=400&width=500"
                alt="ARCX team working together"
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Transformation Section */}
      <section className="py-16 bg-blue-50">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1 rounded-lg overflow-hidden shadow-xl">
              <img
                src="/placeholder.svg?height=400&width=500"
                alt="ARCX software dashboard"
                className="w-full h-auto"
              />
            </div>
            <div className="order-1 md:order-2">
              <h2 className="text-3xl font-bold text-blue-950 mb-6">From Agency to Software Company</h2>
              <p className="text-gray-700 mb-4">
                In 2020, we made a pivotal decision. After seeing the incredible results our tool was generating for our
                own agency, we decided to share it with other marketers facing the same challenges.
              </p>
              <p className="text-gray-700 mb-4">
                We transformed our internal tool into a full-fledged SaaS platform, designed specifically for marketing
                agencies and freelancers. Our unique perspective as marketers ourselves allowed us to create a solution
                that truly addresses the pain points of our industry.
              </p>
              <p className="text-gray-700">
                Today, ARCX Marketing has evolved into a software company, but our roots as marketers remain at the core
                of everything we do. We understand the challenges you face because we've faced them too.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Mission Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl text-center">
          <h2 className="text-3xl font-bold text-blue-950 mb-6">Our Mission</h2>
          <p className="text-xl text-gray-700 mb-8 max-w-3xl mx-auto">
            We're on a mission to empower marketing agencies and freelancers with tools that save time, increase
            efficiency, and drive growth. By automating the tedious aspects of lead generation, we help marketers focus
            on what they do best: creating amazing campaigns and building client relationships.
          </p>
          <div className="flex justify-center">
            <Link
              href="/login?tab=register"
              className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white text-base font-medium rounded-md hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl hover:shadow-blue-200 group"
            >
              Start your free trial
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>

      {/* Team Values Section */}
      <section className="py-16 bg-blue-50">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl">
          <h2 className="text-3xl font-bold text-blue-950 mb-10 text-center">Our Values</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-blue-950 mb-2">Efficiency</h3>
              <p className="text-gray-700">
                We believe in working smarter, not harder. Our tools are designed to automate repetitive tasks and
                streamline workflows.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-blue-950 mb-2">Reliability</h3>
              <p className="text-gray-700">
                We deliver accurate data and dependable tools that marketers can count on to make informed decisions.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-blue-950 mb-2">Adaptability</h3>
              <p className="text-gray-700">
                The marketing landscape is always evolving, and so are we. We continuously improve our tools to meet
                changing needs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl text-center">
          <h2 className="text-3xl font-bold mb-6">Join the ARCX Community</h2>
          <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
            Hundreds of marketing professionals are already using ARCX to transform their lead generation process.
            Experience the difference that software built by marketers, for marketers can make.
          </p>
          <Link
            href="/login?tab=register"
            className="inline-flex items-center justify-center px-8 py-4 bg-white text-blue-600 text-lg font-medium rounded-md hover:bg-blue-50 transition-all shadow-lg hover:shadow-xl hover:shadow-blue-500/20 group"
          >
            Sign up now
            <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Link>
          <p className="mt-6 text-blue-100 text-sm">No credit card required. 3-day free trial.</p>
        </div>
      </section>

      {/* Simplified Footer */}
      <footer className="py-12 bg-blue-950 text-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4 font-heading">ARCX Marketing</h3>
              <p className="text-blue-200 mb-6 max-w-md">
                Helping agencies and freelancers find and connect with their ideal clients through automated research
                and data-driven insights.
              </p>
            </div>

            <div>
              <h4 className="text-lg font-bold mb-4 font-heading">Quick Links</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/about" className="text-blue-200 hover:text-white transition-colors">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/pricing" className="text-blue-200 hover:text-white transition-colors">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="/login" className="text-blue-200 hover:text-white transition-colors">
                    Login
                  </Link>
                </li>
                <li>
                  <Link href="/login?tab=register" className="text-blue-200 hover:text-white transition-colors">
                    Sign Up
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-blue-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <div className="text-sm text-blue-300 mb-4 md:mb-0">
              &copy; {new Date().getFullYear()} ARCX Marketing. All rights reserved.
            </div>
            <div className="flex items-center gap-4">
              <Link href="#" className="text-blue-300 hover:text-white transition-colors">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    fillRule="evenodd"
                    d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                    clipRule="evenodd"
                  />
                </svg>
              </Link>
              <Link href="#" className="text-blue-300 hover:text-white transition-colors">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </Link>
              <Link href="#" className="text-blue-300 hover:text-white transition-colors">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    fillRule="evenodd"
                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                    clipRule="evenodd"
                  />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

