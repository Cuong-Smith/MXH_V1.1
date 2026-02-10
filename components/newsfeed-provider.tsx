"use client"

import { useState, useCallback, type ReactNode } from 'react'
import { NewsfeedContext } from '@/lib/newsfeed-store'
import type { Post, Comment, Story, Notification, User, UserProfile } from '@/lib/types'
import { initialPosts, users, departments, currentUser, initialNotifications, initialGroups } from '@/lib/mock-data'

export function NewsfeedProvider({ children }: { children: ReactNode }) {
  const [posts, setPosts] = useState<Post[]>(initialPosts)
  const [stories, setStories] = useState<Story[]>([])
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications || [])
  const [currentUserData, setCurrentUserData] = useState(currentUser)

  const addPost = useCallback((post: Post) => {
    setPosts((prev) => [post, ...prev])
  }, [])

  const updatePost = useCallback((updatedPost: Post) => {
    setPosts((prev) =>
      prev.map((post) => (post.id === updatedPost.id ? updatedPost : post))
    )
  }, [])

  const deletePost = useCallback((postId: string) => {
    setPosts((prev) => prev.filter((post) => post.id !== postId))
  }, [])

  const updateProfile = useCallback((profileUpdates: Partial<UserProfile>) => {
    setCurrentUserData((prev) => ({
      ...prev,
      profile: prev.profile ? {
        ...prev.profile,
        ...profileUpdates,
      } : profileUpdates as UserProfile,
    }))
  }, [])

  const updateAvatar = useCallback((url: string) => {
    setCurrentUserData((prev) => ({
      ...prev,
      avatar: url,
    }))
  }, [])

  const updateCoverImage = useCallback((url: string) => {
    setCurrentUserData((prev) => ({
      ...prev,
      profile: prev.profile ? {
        ...prev.profile,
        coverImage: url,
      } : { coverImage: url, joinedAt: new Date() } as UserProfile,
    }))
  }, [])

  const addReaction = useCallback((postId: string, emoji: string) => {
    setPosts((prev) =>
      prev.map((post) => {
        if (post.id !== postId) return post
        const existingReaction = post.reactions.find((r) => r.emoji === emoji)
        if (existingReaction) {
          if (existingReaction.users.includes(currentUserData.id)) {
            return post
          }
          return {
            ...post,
            reactions: post.reactions.map((r) =>
              r.emoji === emoji
                ? { ...r, users: [...r.users, currentUserData.id] }
                : r
            ),
          }
        }
        return {
          ...post,
          reactions: [...post.reactions, { emoji, users: [currentUserData.id] }],
        }
      })
    )
  }, [currentUserData.id])

  const removeReaction = useCallback((postId: string, emoji: string) => {
    setPosts((prev) =>
      prev.map((post) => {
        if (post.id !== postId) return post
        return {
          ...post,
          reactions: post.reactions
            .map((r) =>
              r.emoji === emoji
                ? { ...r, users: r.users.filter((u) => u !== currentUserData.id) }
                : r
            )
            .filter((r) => r.users.length > 0),
        }
      })
    )
  }, [currentUserData.id])

  const addComment = useCallback((postId: string, { content, stars }: { content: string; stars?: number }) => {
    const newComment: Comment = {
      id: `cmt-${Date.now()}`,
      authorId: currentUserData.id,
      content,
      createdAt: new Date(),
      reactions: [],
      stars,
      replies: [],
    }
    setPosts((prev) =>
      prev.map((post) =>
        post.id === postId
          ? { ...post, comments: [...post.comments, newComment] }
          : post
      )
    )
  }, [currentUserData.id])

  const addCommentReaction = useCallback((postId: string, commentId: string, emoji: string) => {
    setPosts((prev) =>
      prev.map((post) => {
        if (post.id !== postId) return post
        const updateCommentReactions = (comments: Comment[]): Comment[] =>
          comments.map((comment) => {
            if (comment.id === commentId) {
              const existingReaction = comment.reactions.find((r) => r.emoji === emoji)
              if (existingReaction) {
                if (existingReaction.users.includes(currentUserData.id)) {
                  // Toggle off
                  return {
                    ...comment,
                    reactions: comment.reactions
                      .map((r) =>
                        r.emoji === emoji
                          ? { ...r, users: r.users.filter((u) => u !== currentUserData.id) }
                          : r
                      )
                      .filter((r) => r.users.length > 0),
                  }
                }
                return {
                  ...comment,
                  reactions: comment.reactions.map((r) =>
                    r.emoji === emoji
                      ? { ...r, users: [...r.users, currentUserData.id] }
                      : r
                  ),
                }
              }
              return {
                ...comment,
                reactions: [...comment.reactions, { emoji, users: [currentUserData.id] }],
              }
            }
            if (comment.replies && comment.replies.length > 0) {
              return { ...comment, replies: updateCommentReactions(comment.replies) }
            }
            return comment
          })
        return { ...post, comments: updateCommentReactions(post.comments) }
      })
    )
  }, [currentUserData.id])

  const removeCommentReaction = useCallback((postId: string, commentId: string, emoji: string) => {
    setPosts((prev) =>
      prev.map((post) => {
        if (post.id !== postId) return post
        const updateCommentReactions = (comments: Comment[]): Comment[] =>
          comments.map((comment) => {
            if (comment.id === commentId) {
              return {
                ...comment,
                reactions: comment.reactions
                  .map((r) =>
                    r.emoji === emoji
                      ? { ...r, users: r.users.filter((u) => u !== currentUserData.id) }
                      : r
                  )
                  .filter((r) => r.users.length > 0),
              }
            }
            if (comment.replies && comment.replies.length > 0) {
              return { ...comment, replies: updateCommentReactions(comment.replies) }
            }
            return comment
          })
        return { ...post, comments: updateCommentReactions(post.comments) }
      })
    )
  }, [currentUserData.id])

  const addReply = useCallback((postId: string, commentId: string, { content, mentionName }: { content: string; mentionName?: string }) => {
    const newReply: Comment = {
      id: `reply-${Date.now()}`,
      authorId: currentUserData.id,
      content,
      createdAt: new Date(),
      reactions: [],
      parentId: commentId,
      replies: [],
      mentionName,
    }
    setPosts((prev) =>
      prev.map((post) => {
        if (post.id !== postId) return post
        const addReplyToComments = (comments: Comment[]): Comment[] =>
          comments.map((comment) => {
            if (comment.id === commentId) {
              return {
                ...comment,
                replies: [...(comment.replies || []), newReply],
              }
            }
            if (comment.replies && comment.replies.length > 0) {
              return { ...comment, replies: addReplyToComments(comment.replies) }
            }
            return comment
          })
        return { ...post, comments: addReplyToComments(post.comments) }
      })
    )
  }, [currentUserData.id])

  const votePoll = useCallback((postId: string, optionId: string) => {
    setPosts((prev) =>
      prev.map((post) => {
        if (post.id !== postId || !post.poll) return post
        const hasVoted = post.poll.options.some((opt) =>
          opt.votes.includes(currentUserData.id)
        )
        if (hasVoted && !post.poll.multipleChoice) return post

        return {
          ...post,
          poll: {
            ...post.poll,
            options: post.poll.options.map((opt) =>
              opt.id === optionId
                ? {
                  ...opt,
                  votes: opt.votes.includes(currentUserData.id)
                    ? opt.votes.filter((u) => u !== currentUserData.id)
                    : [...opt.votes, currentUserData.id],
                }
                : opt
            ),
          },
        }
      })
    )
  }, [currentUserData.id])

  const addStory = useCallback((story: Story) => {
    setStories((prev) => [story, ...prev])
  }, [])

  const addNotification = useCallback((notification: Notification) => {
    setNotifications((prev) => [notification, ...prev])
  }, [])

  const markNotificationAsRead = useCallback((notificationId: string) => {
    setNotifications((prev) =>
      prev.map((notif) =>
        notif.id === notificationId ? { ...notif, isRead: true } : notif
      )
    )
  }, [])

  const deleteNotification = useCallback((notificationId: string) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== notificationId))
  }, [])

  return (
    <NewsfeedContext.Provider
      value={{
        posts,
        users,
        departments,
        currentUser: currentUserData,
        groups: initialGroups,
        stories,
        notifications,
        addPost,
        updatePost,
        deletePost,
        addReaction,
        removeReaction,
        addComment,
        addCommentReaction,
        removeCommentReaction,
        addReply,
        votePoll,
        addStory,
        addNotification,
        markNotificationAsRead,
        deleteNotification,
        updateProfile,
        updateAvatar,
        updateCoverImage,
      }}
    >
      {children}
    </NewsfeedContext.Provider>
  )
}
