"use client"

import React from "react"

import { useDevice } from "@/hooks/use-device"
import { AppHeader } from "@/components/app-header"
import { MobileHeader } from "@/components/mobile/mobile-header"
import { MobileTabBar } from "@/components/mobile/mobile-tab-bar"

interface ResponsiveLayoutProps {
  children: React.ReactNode
}

export function ResponsiveLayout({ children }: ResponsiveLayoutProps) {
  const { isMobile } = useDevice()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <main>{children}</main>
  }

  if (isMobile) {
    return (
      <div className="min-h-screen pb-16">
        <MobileHeader />
        <main>{children}</main>
        <MobileTabBar />
      </div>
    )
  }

  return (
    <>
      <AppHeader />
      <main>{children}</main>
    </>
  )
}
