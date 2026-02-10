"use client"

import { useState, useMemo } from "react"
import Image from "next/image"
import Link from "next/link"
import { useParams } from "next/navigation"
import { useDevice } from "@/hooks/use-device"
import { useNewsfeed } from "@/lib/newsfeed-store"
import { users, initialPosts } from "@/lib/mock-data"
import { PostCard } from "@/components/post-card"
import { MobileProfile } from "@/components/mobile/mobile-profile"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  MapPin,
  Home,
  Calendar,
  Briefcase,
  Edit2,
  Camera,
  Facebook,
  Linkedin,
  Github,
  Globe,
  Users,
  Filter,
  Clock,
  Tag,
  User as UserIcon,
  Trophy,
  CheckCircle,
  Code,
  Palette,
  BookOpen,
  Plane,
  Star,
  Heart,
  Plus,
} from "lucide-react"
import type { User, Post, UserProfile } from "@/lib/types"

export default function ProfilePage() {
  const params = useParams()
  const id = params.id as string
  const { isMobile } = useDevice()
  const { posts } = useNewsfeed()
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [activeTab, setActiveTab] = useState("posts")
  const [yearFilter, setYearFilter] = useState<string>("all")
  const [authorFilter, setAuthorFilter] = useState<string>("all")
  const [tagFilter, setTagFilter] = useState<string>("all")
  const [editProfile, setEditProfile] = useState<Partial<UserProfile>>({
    bio: "",
    location: "",
    hometown: "",
    gender: "male",
    socialLinks: {},
  })

  const user = users.find((u) => u.id === id)

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground">Khong tim thay nguoi dung</h1>
          <Link href="/">
            <Button className="mt-4">Quay ve trang chu</Button>
          </Link>
        </div>
      </div>
    )
  }

  const allPosts = [...posts, ...initialPosts]
  const userPosts = allPosts.filter((p) => p.authorId === user.id && p.isPublished)
  const taggedPosts = allPosts.filter((p) => p.taggedUsers.includes(user.id) && p.isPublished)

  const availableYears = useMemo(() => {
    const years = new Set<string>()
    ;[...userPosts, ...taggedPosts].forEach((post) => {
      years.add(new Date(post.createdAt).getFullYear().toString())
    })
    return Array.from(years).sort((a, b) => Number(b) - Number(a))
  }, [userPosts, taggedPosts])

  const availableAuthors = useMemo(() => {
    const authorIds = new Set<string>()
    taggedPosts.forEach((post) => authorIds.add(post.authorId))
    return users.filter((u) => authorIds.has(u.id))
  }, [taggedPosts])

  const filteredPosts = useMemo(() => {
    let postsToFilter: Post[] = []
    
    if (activeTab === "posts") {
      postsToFilter = userPosts
    } else if (activeTab === "tagged") {
      postsToFilter = taggedPosts
    } else {
      postsToFilter = [...userPosts, ...taggedPosts]
    }

    const uniquePosts = postsToFilter.filter(
      (post, index, self) => index === self.findIndex((p) => p.id === post.id)
    )

    return uniquePosts.filter((post) => {
      if (yearFilter !== "all") {
        const postYear = new Date(post.createdAt).getFullYear().toString()
        if (postYear !== yearFilter) return false
      }

      if (authorFilter !== "all" && post.authorId !== authorFilter) {
        return false
      }

      if (tagFilter === "tagged" && !post.taggedUsers.includes(user.id)) {
        return false
      }

      return true
    }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }, [activeTab, userPosts, taggedPosts, yearFilter, authorFilter, tagFilter, user.id])

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("vi-VN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(new Date(date))
  }

  const getGenderLabel = (gender?: string) => {
    switch (gender) {
      case "male":
        return "Nam"
      case "female":
        return "Nu"
      case "other":
        return "Khac"
      default:
        return ""
    }
  }

  if (isMobile) {
    return <MobileProfile userId={id} />
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Cover Photo */}
      <div className="relative h-48 w-full bg-muted sm:h-64 md:h-80">
        {user.profile?.coverImage ? (
          <Image
            src={user.profile.coverImage || "/placeholder.svg"}
            alt="Cover"
            fill
            className="object-cover"
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-r from-orange-400 to-rose-400" />
        )}
        <Button
          variant="secondary"
          size="sm"
          className="absolute bottom-4 right-4 gap-2"
        >
          <Camera className="h-4 w-4" />
          <span className="hidden sm:inline">Doi anh bia</span>
        </Button>
      </div>

      {/* Profile Header */}
      <div className="mx-auto max-w-5xl px-4">
        <div className="relative -mt-16 flex flex-col items-center gap-4 pb-4 sm:-mt-20 sm:flex-row sm:items-end sm:gap-6">
          {/* Avatar */}
          <div className="relative">
            <Avatar className="h-32 w-32 border-4 border-background sm:h-40 sm:w-40">
              <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
              <AvatarFallback className="text-4xl">
                {user.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <Button
              variant="secondary"
              size="icon"
              className="absolute bottom-2 right-2 h-8 w-8 rounded-full"
            >
              <Camera className="h-4 w-4" />
            </Button>
          </div>

          {/* Name & Info */}
          <div className="flex flex-1 flex-col items-center text-center sm:items-start sm:text-left">
            <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
              {user.name}
            </h1>
            <p className="text-muted-foreground">{user.department.name}</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {userPosts.length} bai viet · {taggedPosts.length} bai duoc tag
            </p>
          </div>

          {/* Edit Button */}
          <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
            <DialogTrigger asChild>
              <Button variant="outline" className="gap-2 bg-transparent">
                <Edit2 className="h-4 w-4" />
                Chinh sua trang ca nhan
              </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>Chinh sua thong tin ca nhan</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="bio">Tieu su</Label>
                  <Textarea
                    id="bio"
                    placeholder="Gioi thieu ban than..."
                    value={editProfile.bio || ""}
                    onChange={(e) =>
                      setEditProfile({ ...editProfile, bio: e.target.value })
                    }
                    rows={3}
                  />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="location">Vi tri hien tai</Label>
                    <Input
                      id="location"
                      placeholder="VD: Ha Noi, Viet Nam"
                      value={editProfile.location || ""}
                      onChange={(e) =>
                        setEditProfile({ ...editProfile, location: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="hometown">Que quan</Label>
                    <Input
                      id="hometown"
                      placeholder="VD: Nam Dinh"
                      value={editProfile.hometown || ""}
                      onChange={(e) =>
                        setEditProfile({ ...editProfile, hometown: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="birthday">Ngay sinh</Label>
                    <Input
                      id="birthday"
                      type="date"
                      value={
                        editProfile.birthday
                          ? new Date(editProfile.birthday).toISOString().split("T")[0]
                          : user.profile?.birthday
                          ? new Date(user.profile.birthday).toISOString().split("T")[0]
                          : ""
                      }
                      onChange={(e) =>
                        setEditProfile({
                          ...editProfile,
                          birthday: new Date(e.target.value),
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gender">Gioi tinh</Label>
                    <Select
                      value={editProfile.gender || "male"}
                      onValueChange={(value: "male" | "female" | "other") =>
                        setEditProfile({ ...editProfile, gender: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Nam</SelectItem>
                        <SelectItem value="female">Nu</SelectItem>
                        <SelectItem value="other">Khac</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h4 className="mb-3 font-medium">Lien ket mang xa hoi</h4>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Facebook className="h-5 w-5 text-blue-600" />
                      <Input
                        placeholder="Facebook URL"
                        value={editProfile.socialLinks?.facebook || ""}
                        onChange={(e) =>
                          setEditProfile({
                            ...editProfile,
                            socialLinks: {
                              ...editProfile.socialLinks,
                              facebook: e.target.value,
                            },
                          })
                        }
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <Linkedin className="h-5 w-5 text-blue-700" />
                      <Input
                        placeholder="LinkedIn URL"
                        value={editProfile.socialLinks?.linkedin || ""}
                        onChange={(e) =>
                          setEditProfile({
                            ...editProfile,
                            socialLinks: {
                              ...editProfile.socialLinks,
                              linkedin: e.target.value,
                            },
                          })
                        }
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <Github className="h-5 w-5 text-foreground" />
                      <Input
                        placeholder="GitHub URL"
                        value={editProfile.socialLinks?.github || ""}
                        onChange={(e) =>
                          setEditProfile({
                            ...editProfile,
                            socialLinks: {
                              ...editProfile.socialLinks,
                              github: e.target.value,
                            },
                          })
                        }
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <Globe className="h-5 w-5 text-green-600" />
                      <Input
                        placeholder="Website URL"
                        value={editProfile.socialLinks?.website || ""}
                        onChange={(e) =>
                          setEditProfile({
                            ...editProfile,
                            socialLinks: {
                              ...editProfile.socialLinks,
                              website: e.target.value,
                            },
                          })
                        }
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => setShowEditDialog(false)}
                  >
                    Huy
                  </Button>
                  <Button
                    className="bg-gradient-to-r from-orange-500 to-rose-500 text-white"
                    onClick={() => setShowEditDialog(false)}
                  >
                    Luu thay doi
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Content Grid */}
        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          {/* Left Sidebar - About */}
          <div className="space-y-4">
            {/* Intro Card */}
            <Card>
              <CardContent className="p-4">
                <h3 className="mb-4 font-semibold text-foreground">Gioi thieu</h3>
                {user.profile?.bio && (
                  <p className="mb-4 text-center text-sm text-muted-foreground">
                    {user.profile.bio}
                  </p>
                )}
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <Briefcase className="h-4 w-4 text-muted-foreground" />
                    <span>
                      Lam viec tai <strong>{user.department.name}</strong>
                    </span>
                  </div>
                  {user.profile?.location && (
                    <div className="flex items-center gap-3 text-sm">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>
                        Song tai <strong>{user.profile.location}</strong>
                      </span>
                    </div>
                  )}
                  {user.profile?.hometown && (
                    <div className="flex items-center gap-3 text-sm">
                      <Home className="h-4 w-4 text-muted-foreground" />
                      <span>
                        Den tu <strong>{user.profile.hometown}</strong>
                      </span>
                    </div>
                  )}
                  {user.profile?.birthday && (
                    <div className="flex items-center gap-3 text-sm">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>
                        Sinh ngay{" "}
                        <strong>{formatDate(user.profile.birthday)}</strong>
                      </span>
                    </div>
                  )}
                  {user.profile?.gender && (
                    <div className="flex items-center gap-3 text-sm">
                      <UserIcon className="h-4 w-4 text-muted-foreground" />
                      <span>
                        Gioi tinh <strong>{getGenderLabel(user.profile.gender)}</strong>
                      </span>
                    </div>
                  )}
                  {user.profile?.joinedAt && (
                    <div className="flex items-center gap-3 text-sm">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>
                        Tham gia tu{" "}
                        <strong>{formatDate(user.profile.joinedAt)}</strong>
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Social Links Card */}
            {user.profile?.socialLinks &&
              Object.values(user.profile.socialLinks).some((v) => v) && (
                <Card>
                  <CardContent className="p-4">
                    <h3 className="mb-4 font-semibold text-foreground">
                      Lien ket mang xa hoi
                    </h3>
                    <div className="space-y-3">
                      {user.profile.socialLinks.facebook && (
                        <a
                          href={user.profile.socialLinks.facebook}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground transition-colors"
                        >
                          <Facebook className="h-5 w-5 text-blue-600" />
                          <span>Facebook</span>
                        </a>
                      )}
                      {user.profile.socialLinks.linkedin && (
                        <a
                          href={user.profile.socialLinks.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground transition-colors"
                        >
                          <Linkedin className="h-5 w-5 text-blue-700" />
                          <span>LinkedIn</span>
                        </a>
                      )}
                      {user.profile.socialLinks.github && (
                        <a
                          href={user.profile.socialLinks.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground transition-colors"
                        >
                          <Github className="h-5 w-5" />
                          <span>GitHub</span>
                        </a>
                      )}
                      {user.profile.socialLinks.website && (
                        <a
                          href={user.profile.socialLinks.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground transition-colors"
                        >
                          <Globe className="h-5 w-5 text-green-600" />
                          <span>Website</span>
                        </a>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

            {/* Featured Stories Card */}
            {user.profile?.featuredStories && user.profile.featuredStories.length > 0 && (
              <Card>
                <CardContent className="p-4">
                  <h3 className="mb-4 font-semibold text-foreground">Tin noi bat</h3>
                  <div className="flex gap-3 overflow-x-auto pb-2">
                    {user.profile.featuredStories.map((story) => (
                      <button
                        key={story.id}
                        type="button"
                        className="flex flex-col items-center gap-2 flex-shrink-0"
                      >
                        <div className="relative h-24 w-20 overflow-hidden rounded-xl bg-muted">
                          <Image
                            src={story.coverImage || "/placeholder.svg"}
                            alt={story.name}
                            fill
                            className="object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        </div>
                        <span className="text-xs text-muted-foreground max-w-[80px] truncate">
                          {story.name}
                        </span>
                      </button>
                    ))}
                    <button
                      type="button"
                      className="flex flex-col items-center gap-2 flex-shrink-0"
                    >
                      <div className="flex h-24 w-20 items-center justify-center rounded-xl border-2 border-dashed border-muted-foreground/30 bg-muted/50">
                        <Plus className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <span className="text-xs text-muted-foreground">Them moi</span>
                    </button>
                  </div>
                  <Button variant="outline" className="mt-3 w-full text-sm bg-transparent">
                    Chinh sua tin noi bat
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Achievements Card */}
            {user.profile?.achievements && user.profile.achievements.length > 0 && (
              <Card>
                <CardContent className="p-4">
                  <h3 className="mb-4 font-semibold text-foreground">Thanh tich</h3>
                  <div className="space-y-3">
                    {user.profile.achievements.slice(0, 3).map((achievement) => {
                      const AchievementIcon = achievement.icon === 'trophy' ? Trophy 
                        : achievement.icon === 'check-circle' ? CheckCircle 
                        : achievement.icon === 'users' ? Users 
                        : Star
                      return (
                        <div key={achievement.id} className="flex items-start gap-3">
                          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-amber-100">
                            <AchievementIcon className="h-5 w-5 text-amber-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-foreground truncate">
                              {achievement.title}
                            </p>
                            {achievement.description && (
                              <p className="text-xs text-muted-foreground line-clamp-1">
                                {achievement.description}
                              </p>
                            )}
                            <p className="text-xs text-muted-foreground">
                              {formatDate(achievement.date)}
                            </p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                  {user.profile.achievements.length > 3 && (
                    <Button variant="link" className="mt-2 h-auto p-0 text-sm">
                      Xem tat ca {user.profile.achievements.length} thanh tich
                    </Button>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Interests Card */}
            {user.profile?.interests && user.profile.interests.length > 0 && (
              <Card>
                <CardContent className="p-4">
                  <h3 className="mb-4 font-semibold text-foreground">So thich</h3>
                  <div className="flex flex-wrap gap-2">
                    {user.profile.interests.map((interest) => {
                      const InterestIcon = interest.icon === 'code' ? Code
                        : interest.icon === 'palette' ? Palette
                        : interest.icon === 'trophy' ? Trophy
                        : interest.icon === 'book' ? BookOpen
                        : interest.icon === 'plane' ? Plane
                        : Heart
                      return (
                        <div
                          key={interest.id}
                          className="flex items-center gap-1.5 rounded-full bg-muted px-3 py-1.5"
                        >
                          <InterestIcon className="h-3.5 w-3.5 text-muted-foreground" />
                          <span className="text-sm text-foreground">{interest.name}</span>
                        </div>
                      )
                    })}
                  </div>
                  <Button variant="outline" className="mt-3 w-full text-sm bg-transparent">
                    Chinh sua so thich
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Filters Card */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-4">
                  <Filter className="h-4 w-4 text-muted-foreground" />
                  <h3 className="font-semibold text-foreground">Loc bai viet</h3>
                </div>
                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Nam</Label>
                    <Select value={yearFilter} onValueChange={setYearFilter}>
                      <SelectTrigger className="h-9">
                        <SelectValue placeholder="Tat ca" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tat ca</SelectItem>
                        {availableYears.map((year) => (
                          <SelectItem key={year} value={year}>
                            {year}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Nguoi dang</Label>
                    <Select value={authorFilter} onValueChange={setAuthorFilter}>
                      <SelectTrigger className="h-9">
                        <SelectValue placeholder="Tat ca" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tat ca</SelectItem>
                        <SelectItem value={user.id}>{user.name}</SelectItem>
                        {availableAuthors.map((author) => (
                          <SelectItem key={author.id} value={author.id}>
                            {author.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Loai bai viet</Label>
                    <Select value={tagFilter} onValueChange={setTagFilter}>
                      <SelectTrigger className="h-9">
                        <SelectValue placeholder="Tat ca" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tat ca</SelectItem>
                        <SelectItem value="tagged">Duoc gan the</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content - Posts */}
          <div className="lg:col-span-2">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-4 w-full justify-start bg-muted/50">
                <TabsTrigger value="posts" className="gap-2">
                  <Users className="h-4 w-4" />
                  Bai viet
                  <span className="ml-1 rounded-full bg-muted px-2 py-0.5 text-xs">
                    {userPosts.length}
                  </span>
                </TabsTrigger>
                <TabsTrigger value="tagged" className="gap-2">
                  <Tag className="h-4 w-4" />
                  Duoc tag
                  <span className="ml-1 rounded-full bg-muted px-2 py-0.5 text-xs">
                    {taggedPosts.length}
                  </span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="posts" className="mt-0 space-y-4">
                {filteredPosts.length > 0 ? (
                  filteredPosts.map((post) => (
                    <PostCard key={post.id} post={post} />
                  ))
                ) : (
                  <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12">
                      <Users className="h-12 w-12 text-muted-foreground/50" />
                      <p className="mt-4 text-muted-foreground">
                        Chua co bai viet nao
                      </p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="tagged" className="mt-0 space-y-4">
                {filteredPosts.length > 0 ? (
                  filteredPosts.map((post) => (
                    <PostCard key={post.id} post={post} />
                  ))
                ) : (
                  <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12">
                      <Tag className="h-12 w-12 text-muted-foreground/50" />
                      <p className="mt-4 text-muted-foreground">
                        Chua duoc tag trong bai viet nao
                      </p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}
