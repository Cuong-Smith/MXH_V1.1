"use client"

import React from "react"
import { ChatSidebar, MOCK_CHATS } from "./chat-sidebar"
import { ChatMessages } from "./chat-messages"
import { ChatDetails } from "./chat-details"
import { ThreadMessages } from "./thread-messages"

export function ChatLayout() {
    const [selectedChatId, setSelectedChatId] = React.useState("1")
    const [activeThread, setActiveThread] = React.useState<any>(null)

    const activeChat = MOCK_CHATS.find(c => c.id === selectedChatId)
    const isGroup = activeChat?.type === "group"

    const handleSelectChat = (id: string) => {
        setSelectedChatId(id)
        setActiveThread(null) // Reset thread view when switching chats
    }

    return (
        <div className="flex h-[calc(100vh-64px)] overflow-hidden">
            <ChatSidebar
                selectedChatId={selectedChatId}
                onSelectChat={handleSelectChat}
            />
            {activeThread ? (
                <ThreadMessages
                    thread={activeThread}
                    onBack={() => setActiveThread(null)}
                />
            ) : (
                <ChatMessages
                    activeChatId={selectedChatId}
                    isGroup={isGroup}
                    onThreadClick={(thread: any) => setActiveThread(thread)}
                />
            )}
            <ChatDetails isGroup={isGroup} />
        </div>
    )
}
