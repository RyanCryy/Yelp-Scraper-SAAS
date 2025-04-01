"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"

type AnimationType = "fade-in" | "fade-in-up" | "fade-in-left" | "fade-in-right"

interface AnimateOnScrollProps {
  children: React.ReactNode
  animation?: AnimationType
  delay?: number
  threshold?: number
  className?: string
}

export function AnimateOnScroll({
  children,
  animation = "fade-in-up",
  delay = 0,
  threshold = 0.1,
  className = "",
}: AnimateOnScrollProps) {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.unobserve(entry.target)
        }
      },
      {
        threshold,
      },
    )

    const currentRef = ref.current
    if (currentRef) {
      observer.observe(currentRef)
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef)
      }
    }
  }, [threshold])

  return (
    <div
      ref={ref}
      className={`${className} ${isVisible ? `animate-${animation}` : "opacity-0"}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </div>
  )
}

