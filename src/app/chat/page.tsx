'use client'

import { useState, useEffect, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAuth } from "@/contexts/AuthContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  Send, 
  Phone, 
  MessageCircle, 
  ArrowLeft, 
  MoreVertical,
  Paperclip,
  Image,
  Clock,
  Check,
  CheckCheck
} from "lucide-react"
import Link from "next/link"

interface Message {
  id: string
  content: string
  type: string
  createdAt: string
  senderId: string
  receiverId: string
  listingId: string
  sender: {
    id: string
    name: string
    profileImage?: string
  }
  receiver: {
    id: string
    name: string
    profileImage?: string
  }
  listing: {
    id: string
    title: string
    price: number
    category: string
  }
}

interface ChatUser {
  id: string
  name: string
  profileImage?: string
  lastMessage?: string
  lastMessageTime?: string
  unreadCount?: number
  listing?: {
    id: string
    title: string
    price: number
    category: string
  }
}

export default function ChatPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const [activeChat, setActiveChat] = useState<string | null>(params.userId as string || null)
  const [messages, setMessages] = useState<Message[]>([])
  const [chatUsers, setChatUsers] = useState<ChatUser[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [loadingMessages, setLoadingMessages] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (user) {
      fetchChatUsers()
    }
  }, [user])

  useEffect(() => {
    if (activeChat && user) {
      fetchMessages()
    }
  }, [activeChat, user])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const fetchChatUsers = async () => {
    try {
      // In a real implementation, you'd fetch users the current user has chatted with
      // For demo, we'll use mock data
      const mockUsers: ChatUser[] = [
        {
          id: 'user2',
          name: 'Rahul Sharma',
          lastMessage: 'Is the book still available?',
          lastMessageTime: '2 hours ago',
          unreadCount: 2,
          listing: {
            id: '1',
            title: 'Engineering Mathematics Textbook',
            price: 450,
            category: 'BOOKS'
          }
        },
        {
          id: 'user3',
          name: 'Priya Patel',
          lastMessage: 'Thanks for the notes!',
          lastMessageTime: '1 day ago',
          unreadCount: 0,
          listing: {
            id: '2',
            title: 'Physics Notes Semester 1',
            price: 200,
            category: 'NOTES'
          }
        },
        {
          id: 'user4',
          name: 'Amit Kumar',
          lastMessage: 'Can we meet tomorrow?',
          lastMessageTime: '3 days ago',
          unreadCount: 1,
          listing: {
            id: '3',
            title: 'Hero Cycle in good condition',
            price: 3500,
            category: 'BIKES'
          }
        }
      ]
      setChatUsers(mockUsers)
    } catch (error) {
      console.error('Error fetching chat users:', error)
    }
  }

  const fetchMessages = async () => {
    if (!activeChat || !user) return

    setLoadingMessages(true)
    try {
      const response = await fetch(`/api/chat/send?userId=${user.id}&otherUserId=${activeChat}`)
      const data = await response.json()
      
      if (data.success) {
        setMessages(data.messages)
      }
    } catch (error) {
      console.error('Error fetching messages:', error)
    } finally {
      setLoadingMessages(false)
    }
  }

  const sendMessage = async () => {
    if (!newMessage.trim() || !activeChat || !user) return

    setLoading(true)
    try {
      // For demo, we'll use a mock listing ID
      const listingId = '1'
      
      const response = await fetch('/api/chat/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          senderId: user.id,
          receiverId: activeChat,
          listingId,
          content: newMessage.trim(),
          type: 'TEXT'
        })
      })

      const data = await response.json()

      if (data.success) {
        // Add message to local state
        setMessages(prev => [...prev, data.data])
        setNewMessage('')
        
        // Update chat users list
        setChatUsers(prev => prev.map(chatUser => 
          chatUser.id === activeChat 
            ? { ...chatUser, lastMessage: newMessage.trim(), lastMessageTime: 'Just now', unreadCount: 0 }
            : chatUser
        ))
      }
    } catch (error) {
      console.error('Error sending message:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'Just now'
    if (diffInHours < 24) return `${diffInHours}h ago`
    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) return `${diffInDays}d ago`
    return date.toLocaleDateString()
  }

  const getCategoryIcon = (category: string) => {
    const icons: { [key: string]: string } = {
      'NOTES': '📝',
      'BOOKS': '📚',
      'BIKES': '🚲',
      'FOOD_TOKENS': '🍽️',
      'ROOM_RENTALS': '🏠'
    }
    return icons[category] || '📦'
  }

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'NOTES': 'bg-blue-100 text-blue-700',
      'BOOKS': 'bg-green-100 text-green-700',
      'BIKES': 'bg-purple-100 text-purple-700',
      'FOOD_TOKENS': 'bg-orange-100 text-orange-700',
      'ROOM_RENTALS': 'bg-pink-100 text-pink-700'
    }
    return colors[category] || 'bg-gray-100 text-gray-700'
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>Authentication Required</CardTitle>
            <CardDescription>Please log in to access chat</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/">
              <Button className="w-full">Go to Login</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/" className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
                <ArrowLeft className="w-4 h-4" />
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white text-sm font-bold">CE</span>
                </div>
                <span className="font-semibold">Campus Exchange</span>
              </Link>
            </div>
            <h1 className="text-xl font-semibold">Messages</h1>
            <div className="w-8"></div> {/* Spacer for alignment */}
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 h-[calc(100vh-120px)]">
        <div className="flex gap-6 h-full">
          {/* Chat List */}
          <div className={`w-80 flex-shrink-0 border rounded-lg bg-white ${activeChat ? 'hidden lg:block' : 'block'}`}>
            <div className="p-4 border-b">
              <h2 className="text-lg font-semibold mb-4">Chats</h2>
              <div className="relative">
                <MessageCircle className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search chats..."
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="overflow-y-auto h-[calc(100%-80px)]">
              {chatUsers.map((chatUser) => (
                <div
                  key={chatUser.id}
                  className={`p-4 border-b hover:bg-gray-50 cursor-pointer transition-colors ${
                    activeChat === chatUser.id ? 'bg-blue-50 border-blue-200' : ''
                  }`}
                  onClick={() => setActiveChat(chatUser.id)}
                >
                  <div className="flex items-start gap-3">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={chatUser.profileImage} />
                      <AvatarFallback>
                        {chatUser.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-semibold text-gray-900 truncate">
                          {chatUser.name}
                        </h3>
                        <span className="text-xs text-gray-500">
                          {chatUser.lastMessageTime}
                        </span>
                      </div>
                      
                      {chatUser.listing && (
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className={`${getCategoryColor(chatUser.listing.category)} text-xs`}>
                            <span className="mr-1">{getCategoryIcon(chatUser.listing.category)}</span>
                            {chatUser.listing.category.replace('_', ' ')}
                          </Badge>
                          <span className="text-sm text-green-600 font-semibold">
                            ₹{chatUser.listing.price}
                          </span>
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-600 truncate">
                          {chatUser.lastMessage}
                        </p>
                        {chatUser.unreadCount && chatUser.unreadCount > 0 && (
                          <Badge className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center p-0">
                            {chatUser.unreadCount}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {chatUsers.length === 0 && (
                <div className="text-center py-8">
                  <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No conversations yet</p>
                  <p className="text-sm text-gray-400 mt-1">Start chatting with sellers or buyers</p>
                </div>
              )}
            </div>
          </div>

          {/* Chat Area */}
          <div className={`flex-1 flex flex-col ${activeChat ? 'flex' : 'hidden lg:flex'}`}>
            {activeChat ? (
              <>
                {/* Chat Header */}
                <div className="bg-white border rounded-t-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="lg:hidden"
                        onClick={() => setActiveChat(null)}
                      >
                        <ArrowLeft className="w-4 h-4" />
                      </Button>
                      
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={chatUsers.find(u => u.id === activeChat)?.profileImage} />
                        <AvatarFallback>
                          {chatUsers.find(u => u.id === activeChat)?.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div>
                        <h3 className="font-semibold">
                          {chatUsers.find(u => u.id === activeChat)?.name}
                        </h3>
                        {chatUsers.find(u => u.id === activeChat)?.listing && (
                          <div className="flex items-center gap-2">
                            <Badge className={`${getCategoryColor(chatUsers.find(u => u.id === activeChat)!.listing.category)} text-xs`}>
                              {getCategoryIcon(chatUsers.find(u => u.id === activeChat)!.listing.category)}
                              {chatUsers.find(u => u.id === activeChat)!.listing.title}
                            </Badge>
                            <span className="text-sm text-green-600 font-semibold">
                              ₹{chatUsers.find(u => u.id === activeChat)!.listing.price}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm">
                        <Phone className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                  {loadingMessages ? (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center">
                        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                        <p className="text-gray-600 text-sm">Loading messages...</p>
                      </div>
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center">
                        <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500">No messages yet</p>
                        <p className="text-sm text-gray-400 mt-1">Start the conversation</p>
                      </div>
                    </div>
                  ) : (
                    messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.senderId === user.id ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                            message.senderId === user.id
                              ? 'bg-blue-600 text-white'
                              : 'bg-white border'
                          }`}
                        >
                          <p className="text-sm">{message.content}</p>
                          <div className={`flex items-center gap-1 mt-1 ${
                            message.senderId === user.id ? 'justify-end' : 'justify-start'
                          }`}>
                            <span className={`text-xs ${
                              message.senderId === user.id ? 'text-blue-100' : 'text-gray-500'
                            }`}>
                              {formatTimeAgo(message.createdAt)}
                            </span>
                            {message.senderId === user.id && (
                              <CheckCheck className="w-3 h-3 text-blue-100" />
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Message Input */}
                <div className="bg-white border rounded-b-lg p-4">
                  <div className="flex items-end gap-2">
                    <Button variant="ghost" size="sm" className="pb-2">
                      <Paperclip className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="pb-2">
                      <Image className="w-4 h-4" alt="Attach image" />
                    </Button>
                    
                    <div className="flex-1">
                      <Input
                        placeholder="Type a message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        className="min-h-[40px]"
                      />
                    </div>
                    
                    <Button 
                      onClick={sendMessage} 
                      disabled={!newMessage.trim() || loading}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      {loading ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Send className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center bg-gray-50 rounded-lg">
                <div className="text-center">
                  <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">Select a conversation</h3>
                  <p className="text-gray-500">Choose a chat from the list to start messaging</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}