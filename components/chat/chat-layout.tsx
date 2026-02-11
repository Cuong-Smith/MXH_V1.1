"use client"

import React from "react"
import { ChatSidebar, MOCK_CHATS } from "./chat-sidebar"
import { ChatMessages, Message } from "./chat-messages"
import { ChatDetails } from "./chat-details"
import { ThreadMessages } from "./thread-messages"

const MOCK_MESSAGES_BY_CHAT: Record<string, Message[]> = {
    "1": [
        {
            id: "1",
            type: "text",
            title: "",
            date: "Sáng nay",
            content: "Chào mọi người, dự án Fastdo AI thế nào rồi?",
            author: "Nguyễn Thị Hồng Hạnh",
            tags: ["Dự án", "Fastdo"],
            isSelf: false
        },
        {
            id: "2",
            type: "text",
            title: "",
            date: "10:30",
            content: "Chúng tôi đang triển khai các tính năng mới cho phần Chat.",
            author: "Bạn",
            isSelf: true
        }
    ],
    "6": [
        {
            id: "1",
            type: "text",
            title: "",
            date: "Hôm qua",
            content: "Mọi người đã xem file thiết kế mới chưa?",
            author: "Nguyễn Văn A",
            isSelf: false
        },
        {
            id: "2",
            type: "text",
            title: "",
            date: "09:15",
            content: "Tôi vừa gửi file Figma vào nhóm rồi nhé.",
            author: "Nguyễn Văn A",
            isSelf: false
        }
    ],
    "3": [
        {
            id: "1",
            type: "text",
            title: "",
            date: "7 ngày trước",
            content: "Chào Như, bạn có rảnh không?",
            author: "Bạn",
            isSelf: true
        },
        {
            id: "2",
            type: "text",
            title: "",
            date: "Thứ 2",
            content: "ờ ra v",
            author: "Phạm Thị Quỳnh Như",
            isSelf: false
        }
    ],
    "4": [
        {
            id: "1",
            type: "text",
            title: "",
            date: "Vừa xong",
            content: "Bắt đầu cuộc trò chuyện với Bùi Anh Tuấn",
            author: "Hệ thống",
            isSelf: false
        }
    ],
    "2": [
        {
            id: "1",
            type: "text",
            title: "",
            date: "Hôm nay",
            content: "Tôi có thể giúp gì cho bạn trong việc tra cứu thông tin?",
            author: "AI tra cứu",
            isSelf: false
        }
    ],
    "5": [
        {
            id: "1",
            type: "text",
            title: "",
            date: "Sáng nay",
            content: "Chào Hiền, báo cáo hôm nay thế nào rồi?",
            author: "Bạn",
            isSelf: true
        }
    ]
}

export function ChatLayout() {
    const [selectedChatId, setSelectedChatId] = React.useState("1")
    const [messages, setMessages] = React.useState<Message[]>([])
    const [activeThread, setActiveThread] = React.useState<any>(null)

    React.useEffect(() => {
        setMessages(MOCK_MESSAGES_BY_CHAT[selectedChatId] || [])
    }, [selectedChatId])

    const activeChat = MOCK_CHATS.find(c => c.id === selectedChatId)
    const isGroup = activeChat?.type === "group"
    const pinnedMessages = messages.filter(m => m.isPinned)

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
                    messages={messages}
                    onUpdateMessages={setMessages}
                    chatName={activeChat?.name}
                />
            )}
            <ChatDetails
                isGroup={isGroup}
                chat={activeChat}
                pinnedMessages={pinnedMessages}
            />
        </div>
    )
}
