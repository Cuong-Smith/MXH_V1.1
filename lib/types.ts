export type Visibility = 'private' | 'specific' | 'department' | 'company'

export type Department = {
  id: string
  name: string
}

export type Achievement = {
  id: string
  title: string
  description?: string
  icon: string
  date: Date
}

export type Interest = {
  id: string
  name: string
  icon?: string
}

export type FeaturedStory = {
  id: string
  name: string
  coverImage: string
  storyIds: string[]
}

export type UserProfile = {
  bio?: string
  location?: string
  hometown?: string
  birthday?: Date
  gender?: 'male' | 'female' | 'other'
  coverImage?: string
  socialLinks?: {
    facebook?: string
    linkedin?: string
    github?: string
    website?: string
  }
  joinedAt: Date
  achievements?: Achievement[]
  interests?: Interest[]
  featuredStories?: FeaturedStory[]
}

export type User = {
  id: string
  name: string
  avatar: string
  department: Department
  email: string
  profile?: UserProfile
}

export type Attachment = {
  id: string
  type: 'image' | 'video' | 'sticker'
  url: string
  name?: string
}

export type PollOption = {
  id: string
  text: string
  votes: string[] // user ids
}

export type Poll = {
  id: string
  question: string
  options: PollOption[]
  multipleChoice: boolean
  endsAt?: Date
}

export type Reaction = {
  emoji: string
  users: string[]
}

export type Comment = {
  id: string
  authorId: string
  content: string
  createdAt: Date
  reactions: Reaction[]
  stars?: number // optional: 1-5 stars for special comments
  parentId?: string // id of parent comment for replies
  replies?: Comment[] // nested replies
  mentionName?: string // name of the person being replied to (for reply-to-reply)
}

export type Post = {
  id: string
  authorId: string
  content: string
  visibility: Visibility
  visibleTo?: string[] // user ids for 'specific' visibility
  visibleToDepartments?: string[] // department ids
  attachments: Attachment[]
  poll?: Poll
  taggedUsers: string[]
  reactions: Reaction[]
  comments: Comment[]
  scheduledAt?: Date
  createdAt: Date
  updatedAt: Date
  isPublished: boolean
}

export type EventType = 'meeting' | 'workshop' | 'party' | 'training' | 'other'

// Group types
export type GroupVisibility = 'public' | 'private'
export type GroupMemberRole = 'admin' | 'moderator' | 'member'

export type GroupMember = {
  userId: string
  role: GroupMemberRole
  joinedAt: Date
}

export type GroupJoinRequest = {
  id: string
  userId: string
  message?: string
  createdAt: Date
  status: 'pending' | 'approved' | 'rejected'
}

export type GroupInvitation = {
  id: string
  groupId: string
  invitedUserId: string
  invitedBy: string
  createdAt: Date
  status: 'pending' | 'accepted' | 'declined'
}

export type GroupPost = {
  id: string
  groupId: string
  authorId: string
  content: string
  attachments: Attachment[]
  poll?: Poll
  taggedUsers: string[]
  reactions: Reaction[]
  comments: Comment[]
  isPinned: boolean
  isHidden: boolean
  isApproved: boolean
  createdAt: Date
  updatedAt: Date
}

export type Group = {
  id: string
  name: string
  description: string
  coverImage?: string
  visibility: GroupVisibility
  members: GroupMember[]
  joinRequests: GroupJoinRequest[]
  invitations: GroupInvitation[]
  posts: GroupPost[]
  requirePostApproval: boolean
  createdAt: Date
  createdBy: string
}

export type Event = {
  id: string
  title: string
  description: string
  type: EventType
  coverImage?: string
  location: string
  isOnline: boolean
  meetingUrl?: string
  startDate: Date
  endDate: Date
  organizerId: string
  participants: string[]
  maxParticipants?: number
  visibility: Visibility
  visibleToDepartments?: string[]
  createdAt: Date
}

// Story types
export type StoryMedia = {
  id: string
  type: 'image' | 'video'
  url: string
  duration?: number // for video in seconds
}

export type StoryReaction = {
  id: string
  userId: string
  emoji: string
  createdAt: Date
}

export type StoryReply = {
  id: string
  userId: string
  message: string
  createdAt: Date
}

export type StoryView = {
  userId: string
  viewedAt: Date
}

export type Story = {
  id: string
  authorId: string
  media: StoryMedia
  text?: string
  textPosition?: { x: number; y: number }
  textColor?: string
  backgroundColor?: string
  visibility: Visibility
  visibleTo?: string[]
  visibleToDepartments?: string[]
  taggedUsers: string[]
  reactions: StoryReaction[]
  replies: StoryReply[]
  views: StoryView[]
  isHighlight: boolean
  highlightName?: string
  createdAt: Date
  expiresAt: Date // 24h after creation
}

export type StoryHighlight = {
  id: string
  userId: string
  name: string
  coverStoryId: string
  storyIds: string[]
  createdAt: Date
}

export type NotificationType = 'like' | 'comment' | 'friend_request' | 'post' | 'story' | 'mention'

export type Notification = {
  id: string
  userId: string
  fromUserId: string
  type: NotificationType
  postId?: string
  content: string
  isRead: boolean
  createdAt: Date
}
