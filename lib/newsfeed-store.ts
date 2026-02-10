"use client"

import { createContext, useContext } from 'react'
import type { Post, User, Department, Story, Notification, Group, UserProfile } from './types'

export type NewsfeedContextType = {
  posts: Post[]
  users: User[]
  departments: Department[]
  currentUser: User
  groups: Group[]
  stories?: Story[]
  notifications?: Notification[]
  addPost: (post: Post) => void
  updatePost: (post: Post) => void
  deletePost: (postId: string) => void
  addReaction: (postId: string, emoji: string) => void
  removeReaction: (postId: string, emoji: string) => void
  addComment: (postId: string, comment: { content: string; stars?: number }) => void
  addCommentReaction: (postId: string, commentId: string, emoji: string) => void
  removeCommentReaction: (postId: string, commentId: string, emoji: string) => void
  addReply: (postId: string, commentId: string, reply: { content: string; mentionName?: string }) => void
  votePoll: (postId: string, optionId: string) => void
  addStory?: (story: Story) => void
  addNotification?: (notification: Notification) => void
  markNotificationAsRead?: (notificationId: string) => void
  deleteNotification?: (notificationId: string) => void
  updateProfile: (profile: Partial<UserProfile>) => void
  updateAvatar: (url: string) => void
  updateCoverImage: (url: string) => void
}

export const NewsfeedContext = createContext<NewsfeedContextType | null>(null)

export function useNewsfeed() {
  const context = useContext(NewsfeedContext)
  if (!context) {
    throw new Error('useNewsfeed must be used within a NewsfeedProvider')
  }
  return context
}
