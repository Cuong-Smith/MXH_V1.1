import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"

export default function ProfileLoading() {
  return (
    <div className="min-h-screen bg-background">
      {/* Cover Photo Skeleton */}
      <Skeleton className="h-48 w-full sm:h-64 md:h-80" />

      {/* Profile Header */}
      <div className="mx-auto max-w-5xl px-4">
        <div className="relative -mt-16 flex flex-col items-center gap-4 pb-4 sm:-mt-20 sm:flex-row sm:items-end sm:gap-6">
          {/* Avatar Skeleton */}
          <Skeleton className="h-32 w-32 rounded-full sm:h-40 sm:w-40" />

          {/* Name & Info Skeleton */}
          <div className="flex flex-1 flex-col items-center gap-2 sm:items-start">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-40" />
          </div>

          {/* Button Skeleton */}
          <Skeleton className="h-10 w-48" />
        </div>

        {/* Content Grid */}
        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          {/* Left Sidebar Skeleton */}
          <div className="space-y-4">
            <Card>
              <CardContent className="p-4 space-y-4">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-16 w-full" />
                <div className="space-y-3">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 space-y-4">
                <Skeleton className="h-5 w-32" />
                <div className="space-y-3">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-4 w-20" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Skeleton */}
          <div className="lg:col-span-2 space-y-4">
            <Skeleton className="h-10 w-64" />
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardContent className="p-4 space-y-4">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                  </div>
                  <Skeleton className="h-20 w-full" />
                  <div className="flex gap-4">
                    <Skeleton className="h-8 w-20" />
                    <Skeleton className="h-8 w-20" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
