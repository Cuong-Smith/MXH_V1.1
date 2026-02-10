"use client"

import React from "react"

import { useState, useEffect, useCallback, useRef } from "react"

interface UsePullToRefreshOptions {
  onRefresh: () => Promise<void>
  threshold?: number
  maxPull?: number
}

interface UsePullToRefreshReturn {
  isPulling: boolean
  isRefreshing: boolean
  pullDistance: number
  pullProgress: number
  containerRef: React.RefObject<HTMLDivElement>
}

export function usePullToRefresh({
  onRefresh,
  threshold = 80,
  maxPull = 120,
}: UsePullToRefreshOptions): UsePullToRefreshReturn {
  const [isPulling, setIsPulling] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [pullDistance, setPullDistance] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const startYRef = useRef(0)
  const currentYRef = useRef(0)

  const handleTouchStart = useCallback((e: TouchEvent) => {
    if (isRefreshing) return
    if (!containerRef.current) return
    
    // Only enable if scrolled to top
    if (containerRef.current.scrollTop > 0) return
    
    startYRef.current = e.touches[0].clientY
    currentYRef.current = e.touches[0].clientY
  }, [isRefreshing])

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (isRefreshing) return
    if (!containerRef.current) return
    if (startYRef.current === 0) return
    
    currentYRef.current = e.touches[0].clientY
    const diff = currentYRef.current - startYRef.current
    
    // Only pull down, not up
    if (diff < 0) {
      setPullDistance(0)
      setIsPulling(false)
      return
    }
    
    // Prevent scrolling while pulling
    if (diff > 10) {
      e.preventDefault()
      setIsPulling(true)
      // Add resistance as user pulls further
      const resistance = 0.5
      const adjustedDiff = Math.min(diff * resistance, maxPull)
      setPullDistance(adjustedDiff)
    }
  }, [isRefreshing, maxPull])

  const handleTouchEnd = useCallback(async () => {
    if (isRefreshing) return
    
    startYRef.current = 0
    currentYRef.current = 0
    
    if (pullDistance >= threshold) {
      setIsRefreshing(true)
      setPullDistance(threshold / 2) // Keep some visual indication
      
      try {
        await onRefresh()
      } finally {
        setIsRefreshing(false)
      }
    }
    
    setPullDistance(0)
    setIsPulling(false)
  }, [isRefreshing, pullDistance, threshold, onRefresh])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    container.addEventListener("touchstart", handleTouchStart, { passive: true })
    container.addEventListener("touchmove", handleTouchMove, { passive: false })
    container.addEventListener("touchend", handleTouchEnd, { passive: true })

    return () => {
      container.removeEventListener("touchstart", handleTouchStart)
      container.removeEventListener("touchmove", handleTouchMove)
      container.removeEventListener("touchend", handleTouchEnd)
    }
  }, [handleTouchStart, handleTouchMove, handleTouchEnd])

  const pullProgress = Math.min(pullDistance / threshold, 1)

  return {
    isPulling,
    isRefreshing,
    pullDistance,
    pullProgress,
    containerRef,
  }
}
