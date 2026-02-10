"use client"

import React from "react"

import { useState, useCallback, useRef } from "react"

interface SwipeState {
  startX: number
  startY: number
  currentX: number
  currentY: number
  isSwiping: boolean
}

interface UseSwipeOptions {
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
  onSwipeUp?: () => void
  onSwipeDown?: () => void
  threshold?: number
  preventDefaultOnSwipe?: boolean
}

export function useSwipe(options: UseSwipeOptions = {}) {
  const {
    onSwipeLeft,
    onSwipeRight,
    onSwipeUp,
    onSwipeDown,
    threshold = 50,
    preventDefaultOnSwipe = false,
  } = options

  const [swipeState, setSwipeState] = useState<SwipeState>({
    startX: 0,
    startY: 0,
    currentX: 0,
    currentY: 0,
    isSwiping: false,
  })

  const swipeRef = useRef<SwipeState>(swipeState)
  swipeRef.current = swipeState

  const handleTouchStart = useCallback((e: React.TouchEvent | TouchEvent) => {
    const touch = e.touches[0]
    setSwipeState({
      startX: touch.clientX,
      startY: touch.clientY,
      currentX: touch.clientX,
      currentY: touch.clientY,
      isSwiping: true,
    })
  }, [])

  const handleTouchMove = useCallback((e: React.TouchEvent | TouchEvent) => {
    if (!swipeRef.current.isSwiping) return

    const touch = e.touches[0]
    setSwipeState((prev) => ({
      ...prev,
      currentX: touch.clientX,
      currentY: touch.clientY,
    }))

    if (preventDefaultOnSwipe) {
      e.preventDefault()
    }
  }, [preventDefaultOnSwipe])

  const handleTouchEnd = useCallback(() => {
    const { startX, startY, currentX, currentY, isSwiping } = swipeRef.current

    if (!isSwiping) return

    const deltaX = currentX - startX
    const deltaY = currentY - startY
    const absX = Math.abs(deltaX)
    const absY = Math.abs(deltaY)

    // Determine if it's a horizontal or vertical swipe
    if (absX > absY && absX > threshold) {
      if (deltaX > 0) {
        onSwipeRight?.()
      } else {
        onSwipeLeft?.()
      }
    } else if (absY > absX && absY > threshold) {
      if (deltaY > 0) {
        onSwipeDown?.()
      } else {
        onSwipeUp?.()
      }
    }

    setSwipeState({
      startX: 0,
      startY: 0,
      currentX: 0,
      currentY: 0,
      isSwiping: false,
    })
  }, [onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown, threshold])

  const swipeHandlers = {
    onTouchStart: handleTouchStart,
    onTouchMove: handleTouchMove,
    onTouchEnd: handleTouchEnd,
  }

  const deltaX = swipeState.currentX - swipeState.startX
  const deltaY = swipeState.currentY - swipeState.startY

  return {
    swipeHandlers,
    isSwiping: swipeState.isSwiping,
    deltaX,
    deltaY,
  }
}
