"use client"

import React, { useState, useEffect } from "react"
import { useDevice } from "@/hooks/use-device"
import { Newsfeed } from "@/components/newsfeed"
import { MobileNewsfeed } from "@/components/mobile/mobile-newsfeed"

export default function Page() {
  const { isMobile } = useDevice()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  if (isMobile) {
    return <MobileNewsfeed />
  }

  return <Newsfeed />
}
