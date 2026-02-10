"use client"

import { useState, useEffect } from "react"

type DeviceType = "mobile" | "tablet" | "desktop"

interface DeviceInfo {
  isMobile: boolean
  isTablet: boolean
  isDesktop: boolean
  deviceType: DeviceType
  screenWidth: number
  isTouchDevice: boolean
}

const MOBILE_BREAKPOINT = 768
const TABLET_BREAKPOINT = 1024

export function useDevice(): DeviceInfo {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>({
    isMobile: false,
    isTablet: false,
    isDesktop: true,
    deviceType: "desktop",
    screenWidth: typeof window !== "undefined" ? window.innerWidth : 1024,
    isTouchDevice: false,
  })

  useEffect(() => {
    const checkDevice = () => {
      const width = window.innerWidth
      const isTouchDevice = "ontouchstart" in window || navigator.maxTouchPoints > 0
      
      // Also check user agent for more accurate mobile detection
      const userAgent = navigator.userAgent.toLowerCase()
      const isMobileUserAgent = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent)
      
      let deviceType: DeviceType = "desktop"
      let isMobile = false
      let isTablet = false
      let isDesktop = false

      if (width < MOBILE_BREAKPOINT || (isMobileUserAgent && width < TABLET_BREAKPOINT)) {
        deviceType = "mobile"
        isMobile = true
      } else if (width < TABLET_BREAKPOINT) {
        deviceType = "tablet"
        isTablet = true
      } else {
        deviceType = "desktop"
        isDesktop = true
      }

      setDeviceInfo({
        isMobile,
        isTablet,
        isDesktop,
        deviceType,
        screenWidth: width,
        isTouchDevice,
      })
    }

    checkDevice()
    window.addEventListener("resize", checkDevice)
    return () => window.removeEventListener("resize", checkDevice)
  }, [])

  return deviceInfo
}
