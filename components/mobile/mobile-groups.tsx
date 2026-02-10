"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import {
  Users,
  Plus,
  Search,
  Lock,
  Globe,
  Crown,
  ChevronRight,
  X,
  MessageCircle,
  FileText,
  Image as ImageIcon,
  Shield,
  ArrowLeft,
  Video,
  Clock,
} from "lucide-react"
import { initialGroups, users, currentUser } from "@/lib/mock-data"
import type { Group, GroupMemberRole } from "@/lib/types"
import { cn } from "@/lib/utils"
import { MobilePostCard } from "./mobile-post-card"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"

const roleConfig: Record<GroupMemberRole, { label: string; icon: React.ReactNode; color: string; bgColor: string }> = {
  admin: { label: 'Admin', icon: <Crown className="h-3.5 w-3.5" />, color: 'text-amber-600', bgColor: 'bg-amber-100' },
  moderator: { label: 'Quan tri vien', icon: <Shield className="h-3.5 w-3.5" />, color: 'text-blue-600', bgColor: 'bg-blue-100' },
  member: { label: 'Thanh vien', icon: <Users className="h-3.5 w-3.5" />, color: 'text-muted-foreground', bgColor: 'bg-muted' },
}

function PrivatePlaceholder() {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 text-center h-[400px] bg-background">
      <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center mb-4">
        <Lock className="h-10 w-10 text-muted-foreground/40" />
      </div>
      <h3 className="text-lg font-bold">Day la nhom rieng tu</h3>
      <p className="mt-2 text-sm text-muted-foreground max-w-[280px]">
        Hay tham gia nhom de xem cac bai viet, thanh vien va hinh anh trong nhom nay.
      </p>
    </div>
  )
}

interface MobileGroupCardProps {
  group: Group
  onSelect: () => void
  onJoin: () => void
}

function MobileGroupCard({ group, onSelect, onJoin }: MobileGroupCardProps) {
  const isMember = (group.members || []).some((m) => m.userId === currentUser.id)

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onSelect}
      onKeyDown={(e) => e.key === 'Enter' && onSelect()}
      className="flex w-full items-center gap-3 rounded-xl bg-background p-3 text-left shadow-sm cursor-pointer active:bg-muted/50 transition-colors"
    >
      {/* Group Avatar */}
      <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl bg-muted">
        {group.coverImage ? (
          <Image
            src={group.coverImage || "/placeholder.svg"}
            alt={group.name}
            fill
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/20 to-primary/10">
            <Users className="h-6 w-6 text-primary" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <h3 className="font-semibold text-foreground truncate">{group.name}</h3>
          {group.visibility === 'private' ? (
            <Lock className="h-3.5 w-3.5 flex-shrink-0 text-muted-foreground" />
          ) : (
            <Globe className="h-3.5 w-3.5 flex-shrink-0 text-muted-foreground" />
          )}
        </div>
        <p className="mt-0.5 text-xs text-muted-foreground line-clamp-1">
          {group.description}
        </p>
        <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
          <Users className="h-3.5 w-3.5" />
          <span>{(group.members || []).length} thanh vien</span>
          <span>·</span>
          <span>{group.posts.length} bai viet</span>
        </div>
      </div>

      {/* Action */}
      {isMember ? (
        <Badge variant="outline" className="flex-shrink-0">
          Da tham gia
        </Badge>
      ) : (
        <Button
          size="sm"
          onClick={(e) => {
            e.stopPropagation()
            onJoin()
          }}
          className="flex-shrink-0"
        >
          Tham gia
        </Button>
      )}
    </div>
  )
}

export function MobileGroups() {
  const [groups, setGroups] = useState<Group[]>(initialGroups || [])
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null)
  const [detailTab, setDetailTab] = useState("posts")
  const [newGroupName, setNewGroupName] = useState("")
  const [newGroupDescription, setNewGroupDescription] = useState("")
  const [newGroupPrivate, setNewGroupPrivate] = useState(false)

  const myGroups = (groups || []).filter((g) => (g.members || []).some(m => m.userId === currentUser.id))
  const discoverGroups = (groups || []).filter((g) => !(g.members || []).some(m => m.userId === currentUser.id))

  const filteredGroups =
    activeTab === "my"
      ? myGroups
      : activeTab === "discover"
        ? discoverGroups
        : (groups || [])

  const searchedGroups = (filteredGroups || []).filter(
    (g) =>
      g.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleJoinGroup = (groupId: string) => {
    setGroups((prev) =>
      prev.map((g) =>
        g.id === groupId
          ? { ...g, members: [...(g.members || []), { userId: currentUser.id, role: 'member' as const, joinedAt: new Date() }] }
          : g
      )
    )
  }

  const handleCreateGroup = () => {
    if (!newGroupName.trim()) return
    const newGroup: Group = {
      id: `group-${Date.now()}`,
      name: newGroupName,
      description: newGroupDescription,
      visibility: newGroupPrivate ? 'private' : 'public',
      members: [{ userId: currentUser.id, role: 'admin', joinedAt: new Date() }],
      joinRequests: [],
      invitations: [],
      posts: [],
      requirePostApproval: false,
      createdAt: new Date(),
      createdBy: currentUser.id,
    }
    setGroups((prev) => [newGroup, ...prev])
    setShowCreateDialog(false)
    setNewGroupName("")
    setNewGroupDescription("")
    setNewGroupPrivate(false)
  }

  return (
    <div className="min-h-screen bg-muted/30 pb-20">
      {/* Search Bar */}
      <div className="sticky top-14 z-30 bg-background border-b border-border p-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Tim kiem nhom..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-muted border-0 pl-9"
          />
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full justify-start rounded-none border-b border-border bg-background h-12 px-2">
          <TabsTrigger
            value="all"
            className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
          >
            Tat ca ({groups.length})
          </TabsTrigger>
          <TabsTrigger
            value="my"
            className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
          >
            Cua toi ({myGroups.length})
          </TabsTrigger>
          <TabsTrigger
            value="discover"
            className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
          >
            Kham pha
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-0">
          <div className="space-y-3 p-3">
            {searchedGroups.length > 0 ? (
              searchedGroups.map((group) => (
                <MobileGroupCard
                  key={group.id}
                  group={group}
                  onSelect={() => setSelectedGroup(group)}
                  onJoin={() => handleJoinGroup(group.id)}
                />
              ))
            ) : (
              <div className="py-12 text-center">
                <Users className="mx-auto h-12 w-12 text-muted-foreground" />
                <p className="mt-2 text-muted-foreground">Khong co nhom nao.</p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="my" className="mt-0">
          <div className="space-y-3 p-3">
            {searchedGroups.filter(g => (g.members || []).some(m => m.userId === currentUser.id)).length > 0 ? (
              searchedGroups.filter(g => (g.members || []).some(m => m.userId === currentUser.id)).map((group) => (
                <MobileGroupCard
                  key={group.id}
                  group={group}
                  onSelect={() => setSelectedGroup(group)}
                  onJoin={() => handleJoinGroup(group.id)}
                />
              ))
            ) : (
              <div className="py-12 text-center">
                <Users className="mx-auto h-12 w-12 text-muted-foreground" />
                <p className="mt-2 text-muted-foreground">Khong co nhom nao.</p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="discover" className="mt-0">
          <div className="space-y-3 p-3">
            {searchedGroups.filter(g => !(g.members || []).some(m => m.userId === currentUser.id)).length > 0 ? (
              searchedGroups.filter(g => !(g.members || []).some(m => m.userId === currentUser.id)).map((group) => (
                <MobileGroupCard
                  key={group.id}
                  group={group}
                  onSelect={() => setSelectedGroup(group)}
                  onJoin={() => handleJoinGroup(group.id)}
                />
              ))
            ) : (
              <div className="py-12 text-center">
                <Users className="mx-auto h-12 w-12 text-muted-foreground" />
                <p className="mt-2 text-muted-foreground">Khong co nhom nao.</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* FAB - Create Group */}
      <button
        type="button"
        onClick={() => setShowCreateDialog(true)}
        className="fixed bottom-20 right-4 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg"
      >
        <Plus className="h-6 w-6" />
      </button>

      {/* Group Detail Sheet */}
      {selectedGroup && (
        <Dialog open={!!selectedGroup} onOpenChange={() => { setSelectedGroup(null); setDetailTab("posts"); }}>
          <DialogContent className="h-full max-h-screen w-full max-w-full flex-col rounded-none p-0 sm:rounded-none">
            <DialogHeader className="sr-only">
              <DialogTitle>{selectedGroup.name}</DialogTitle>
            </DialogHeader>

            {/* Custom Header */}
            {(() => {
              const isMemberSelected = (selectedGroup.members || []).some(m => m.userId === currentUser.id)
              const isPrivateRestricted = selectedGroup.visibility === 'private' && !isMemberSelected

              return (
                <>
                  <div className="flex h-14 items-center gap-4 border-b border-border bg-background px-4">
                    <button
                      type="button"
                      onClick={() => { setSelectedGroup(null); setDetailTab("posts"); }}
                      className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-muted"
                    >
                      <ArrowLeft className="h-5 w-5" />
                    </button>
                    <h2 className="flex-1 truncate text-lg font-bold">{selectedGroup.name}</h2>
                    <button className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-muted">
                      <Search className="h-5 w-5" />
                    </button>
                  </div>

                  <div className="flex-1 overflow-y-auto">
                    <div className="pb-20">
                      {/* Cover & General Info */}
                      <div className="relative h-48 w-full">
                        {selectedGroup.coverImage ? (
                          <Image
                            src={selectedGroup.coverImage || "/placeholder.svg"}
                            alt={selectedGroup.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/20 to-primary/10">
                            <Users className="h-12 w-12 text-primary/40" />
                          </div>
                        )}
                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-4 pt-12">
                          <div className="flex items-center gap-2">
                            <Badge className={selectedGroup.visibility === 'private' ? 'bg-amber-500' : 'bg-emerald-500'}>
                              {selectedGroup.visibility === 'private' ? <Lock className="mr-1 h-3 w-3" /> : <Globe className="mr-1 h-3 w-3" />}
                              {selectedGroup.visibility === 'private' ? 'Rieng tu' : 'Cong khai'}
                            </Badge>
                            <span className="text-sm text-white/90">
                              {(selectedGroup.members || []).length} thanh vien
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Tabs Navigation */}
                      <Tabs value={isPrivateRestricted ? "about" : detailTab} onValueChange={setDetailTab} className="w-full">
                        <div className="sticky top-0 z-10 bg-background border-b border-border shadow-sm">
                          <TabsList className="w-full justify-start rounded-none bg-transparent h-12 px-2 overflow-x-auto scrollbar-hide">
                            <TabsTrigger
                              value="posts"
                              disabled={isPrivateRestricted}
                              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4"
                            >
                              {isPrivateRestricted && <Lock className="mr-1.5 h-3 w-3" />}
                              Bai viet
                            </TabsTrigger>
                            <TabsTrigger
                              value="members"
                              disabled={isPrivateRestricted}
                              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4"
                            >
                              {isPrivateRestricted && <Lock className="mr-1.5 h-3 w-3" />}
                              Thanh vien
                            </TabsTrigger>
                            <TabsTrigger
                              value="media"
                              disabled={isPrivateRestricted}
                              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4"
                            >
                              {isPrivateRestricted && <Lock className="mr-1.5 h-3 w-3" />}
                              Anh/Video
                            </TabsTrigger>
                            <TabsTrigger
                              value="about"
                              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4"
                            >
                              Gioi thieu
                            </TabsTrigger>
                          </TabsList>
                        </div>

                        {/* Tab Contents */}
                        <TabsContent value="posts" className="m-0 bg-muted/30 min-h-[400px]">
                          {isPrivateRestricted ? (
                            <PrivatePlaceholder />
                          ) : (
                            <div className="space-y-4 py-3">
                              {selectedGroup.posts && selectedGroup.posts.length > 0 ? (
                                selectedGroup.posts.map((post) => (
                                  <MobilePostCard key={post.id} post={{
                                    ...post,
                                    visibility: selectedGroup.visibility === 'private' ? 'private' : 'company',
                                    isPublished: true,
                                  } as any} />
                                ))
                              ) : (
                                <div className="py-20 text-center bg-background mx-3 rounded-xl border border-dashed border-border">
                                  <FileText className="mx-auto h-12 w-12 text-muted-foreground/30" />
                                  <p className="mt-2 text-muted-foreground">Chua co bai viet nao.</p>
                                  <Button variant="outline" size="sm" className="mt-4">Tao bai viet dau tien</Button>
                                </div>
                              )}
                            </div>
                          )}
                        </TabsContent>

                        <TabsContent value="members" className="m-0 bg-background min-h-[400px] p-4">
                          {isPrivateRestricted ? (
                            <PrivatePlaceholder />
                          ) : (
                            <>
                              <div className="flex items-center justify-between mb-4">
                                <h3 className="font-bold">Thanh vien · {(selectedGroup.members || []).length}</h3>
                                <Button variant="ghost" size="sm" className="text-primary">Xem tat ca</Button>
                              </div>
                              <div className="space-y-4">
                                {[...(selectedGroup.members || [])]
                                  .sort((a, b) => {
                                    const priority: Record<string, number> = { admin: 0, moderator: 1, member: 2 }
                                    return (priority[a.role] ?? 99) - (priority[b.role] ?? 99)
                                  })
                                  .map((member) => {
                                    const user = users.find((u) => u.id === member.userId)
                                    if (!user) return null
                                    return (
                                      <div key={member.userId} className="flex items-center gap-3">
                                        <Avatar className="h-10 w-10">
                                          <AvatarImage src={user.avatar || "/placeholder.svg"} />
                                          <AvatarFallback>{user.name[0]}</AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1 min-w-0">
                                          <p className="font-medium truncate">{user.name}</p>
                                          <p className="text-xs text-muted-foreground">{user.department.name}</p>
                                        </div>
                                        <Badge className={cn("shrink-0", roleConfig[member.role].bgColor, roleConfig[member.role].color)}>
                                          {roleConfig[member.role].label}
                                        </Badge>
                                      </div>
                                    )
                                  })}
                              </div>
                            </>
                          )}
                        </TabsContent>

                        <TabsContent value="media" className="m-0 bg-background min-h-[400px] p-4">
                          {isPrivateRestricted ? (
                            <PrivatePlaceholder />
                          ) : (
                            <div className="grid grid-cols-3 gap-1">
                              {selectedGroup.posts.flatMap(p => p.attachments).filter(a => a.type === 'image' || a.type === 'video').length > 0 ? (
                                selectedGroup.posts.flatMap(p => p.attachments)
                                  .filter(a => a.type === 'image' || a.type === 'video')
                                  .map((att, idx) => (
                                    <div key={idx} className="relative aspect-square overflow-hidden bg-muted">
                                      {att.type === 'image' ? (
                                        <Image src={att.url} alt="Media" fill className="object-cover" />
                                      ) : (
                                        <div className="flex h-full w-full items-center justify-center bg-black">
                                          <Video className="h-6 w-6 text-white" />
                                        </div>
                                      )}
                                    </div>
                                  ))
                              ) : (
                                <div className="col-span-3 py-20 text-center">
                                  <ImageIcon className="mx-auto h-12 w-12 text-muted-foreground/30" />
                                  <p className="mt-2 text-muted-foreground">Chua co anh hoac video nao.</p>
                                </div>
                              )}
                            </div>
                          )}
                        </TabsContent>

                        <TabsContent value="about" className="m-0 bg-background min-h-[400px] p-4">
                          <div className="space-y-6">
                            <section>
                              <h3 className="font-bold mb-2">Gioi thieu</h3>
                              <p className="text-muted-foreground leading-relaxed">{selectedGroup.description}</p>
                            </section>
                            <Separator />
                            <section className="space-y-3">
                              <div className="flex items-center gap-3 text-muted-foreground">
                                <Users className="h-5 w-5" />
                                <div>
                                  <p className="text-sm font-medium text-foreground">{(selectedGroup.members || []).length} thanh vien</p>
                                  <p className="text-xs">Bao gom ca ban va {(selectedGroup.members || []).length - 1} nguoi khac</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-3 text-muted-foreground">
                                {selectedGroup.visibility === 'private' ? <Lock className="h-5 w-5" /> : <Globe className="h-5 w-5" />}
                                <div>
                                  <p className="text-sm font-medium text-foreground">
                                    {selectedGroup.visibility === 'private' ? "Nhom kin" : "Nhom cong khai"}
                                  </p>
                                  <p className="text-xs">
                                    {selectedGroup.visibility === 'private'
                                      ? "Chi thanh vien moi co the xem moi nguoi trong nhom va nhung gi ho dang."
                                      : "Bat ky ai cung co the xem moi nguoi trong nhom va nhung gi ho dang."}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-3 text-muted-foreground">
                                <Clock className="h-5 w-5" />
                                <div>
                                  <p className="text-sm font-medium text-foreground">Ngay tao</p>
                                  <p className="text-xs">Da tao vao thang {new Date(selectedGroup.createdAt).getMonth() + 1}, {new Date(selectedGroup.createdAt).getFullYear()}</p>
                                </div>
                              </div>
                            </section>
                          </div>
                        </TabsContent>
                      </Tabs>
                    </div>
                  </div>
                </>
              )
            })()}

            {/* Bottom Actions */}
            <div className="fixed bottom-0 inset-x-0 border-t border-border bg-background p-4 safe-area-bottom">
              {(selectedGroup.members || []).some(m => m.userId === currentUser.id) ? (
                <div className="flex gap-2">
                  <Button className="flex-1 bg-muted text-foreground hover:bg-muted/80" variant="secondary">
                    <MessageCircle className="mr-2 h-4 w-4" />
                    Tro chuyen
                  </Button>
                  <Button className="flex-1" onClick={() => { /* Navigation logic for group feed */ }}>
                    Vao nhom
                  </Button>
                </div>
              ) : (
                <Button
                  className="w-full"
                  onClick={() => {
                    handleJoinGroup(selectedGroup.id)
                  }}
                >
                  Tham gia nhom
                </Button>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Create Group Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="h-full max-h-screen w-full max-w-full rounded-none p-0 sm:rounded-none">
          <DialogHeader className="flex-row items-center justify-between border-b border-border px-4 py-3">
            <Button variant="ghost" size="sm" onClick={() => setShowCreateDialog(false)}>
              Huy
            </Button>
            <DialogTitle className="text-base font-semibold">Tao nhom</DialogTitle>
            <Button size="sm" disabled={!newGroupName.trim()} onClick={handleCreateGroup}>
              Tao
            </Button>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-4">
              <div>
                <Label>Ten nhom</Label>
                <Input
                  placeholder="Nhap ten nhom..."
                  className="mt-1.5"
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                />
              </div>
              <div>
                <Label>Mo ta</Label>
                <Textarea
                  placeholder="Mo ta nhom..."
                  className="mt-1.5"
                  value={newGroupDescription}
                  onChange={(e) => setNewGroupDescription(e.target.value)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Nhom kin</Label>
                  <p className="text-xs text-muted-foreground">
                    Chi thanh vien moi xem duoc noi dung
                  </p>
                </div>
                <Switch
                  checked={newGroupPrivate}
                  onCheckedChange={setNewGroupPrivate}
                />
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
