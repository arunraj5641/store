import { useState, useRef, useEffect } from 'react'
import { Sparkles, Send, Bot, User, Zap, RefreshCw, MessageSquare, Plus } from 'lucide-react'
import Header from '../components/common/Header'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import aiService from '../services/ai'
import { getFriendlyErrorMessage } from '../services/api/errors'
import {
  clearStoredAssistantChatMessages,
  loadStoredAssistantChatMessages,
  storeAssistantChatMessages,
} from '../services/ai/chatSession'

const chatTimestamp = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

const initialMessages = () => [
  {
    id: 'welcome',
    sender: 'ai',
    text: 'Hello! I am your Kirana OS AI Co-pilot. Ask me a question and I will route it to the live AI service.',
    time: chatTimestamp(),
  },
]

const Assistant = () => {
  const [messages, setMessages] = useState(() => loadStoredAssistantChatMessages() || initialMessages())

  const [inputQuery, setInputQuery] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const chatEndRef = useRef(null)

  const promptSuggestions = [
    'Which items have the highest profit margins this month?',
    'Draft supplier purchase order for low stock items.',
    'List customers with overdue Udhar credit balance.',
    'Predict weekend store revenue forecast.',
  ]

  const chatHistory = [
    'Inventory Reorder Plan - July 31',
    'Udhar Ledger Summary - July 30',
    'Festival Sales Forecast - July 28',
  ]

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  useEffect(() => {
    storeAssistantChatMessages(messages)
  }, [messages])

  const handleStartNewChat = () => {
    clearStoredAssistantChatMessages()
    setMessages(initialMessages())
    setInputQuery('')
  }

  const handleSendMessage = async (textToSend) => {
    const query = (textToSend || inputQuery).trim()
    if (!query.trim()) return

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: query,
      time: chatTimestamp(),
    }

    setMessages((prev) => [...prev, userMsg])
    setInputQuery('')
    setIsTyping(true)

    try {
      const response = await aiService.chat(query)
      const aiMsg = {
        id: Date.now() + 1,
        sender: 'ai',
        text: response.data?.reply || 'AI Co-pilot did not return a response. Please try again.',
        time: chatTimestamp(),
      }

      setMessages((prev) => [...prev, aiMsg])
    } catch (error) {
      const aiMsg = {
        id: Date.now() + 1,
        sender: 'ai',
        text: getFriendlyErrorMessage(error, 'AI Co-pilot is unavailable right now. Please try again shortly.', {
          serviceMessage: 'AI Co-pilot is taking longer than expected. Try a shorter question or try again shortly.',
          validationMessage: 'Please enter a question for AI Co-pilot.',
        }),
        time: chatTimestamp(),
      }

      setMessages((prev) => [...prev, aiMsg])
    } finally {
      setIsTyping(false)
    }
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <Header
        title="AI Store Co-Pilot"
        description="Ask intelligent questions about inventory forecasts, profit margins, supplier orders, and credit ledgers."
        badge="AI Co-pilot v1.0"
        actions={
          <Button variant="outline" size="sm" onClick={handleStartNewChat}>
            <RefreshCw className="h-3.5 w-3.5" /> Clear Chat
          </Button>
        }
      />

      {/* Suggested Prompt Chips */}
      <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {promptSuggestions.map((prompt, index) => (
          <button
            key={index}
            onClick={() => handleSendMessage(prompt)}
            className="flex items-center gap-2.5 rounded-2xl border border-[#1F2937] bg-[#111827]/70 p-3.5 text-left text-xs text-[#94A3B8] transition duration-200 hover:border-[#00D9FF]/40 hover:bg-[#111827] hover:text-[#F8FAFC] group"
          >
            <Zap className="h-4 w-4 shrink-0 text-[#00D9FF] group-hover:scale-110 transition" />
            <span className="line-clamp-2">{prompt}</span>
          </button>
        ))}
      </div>

      {/* Main Split Console: History Sidebar + Active Chat Window */}
      <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
        {/* History Sidebar */}
        <Card title="Saved Conversations" className="hidden lg:flex flex-col justify-between h-[540px] p-4">
          <div className="space-y-2">
            <Button variant="outline" size="sm" className="w-full justify-start text-xs" onClick={handleStartNewChat}>
              <Plus className="h-3.5 w-3.5" /> New Conversation
            </Button>
            <div className="pt-3 space-y-1">
              <span className="text-[10px] uppercase font-semibold text-[#94A3B8] px-2 block mb-1">
                Recent Chats
              </span>
              {chatHistory.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 rounded-xl px-2.5 py-2 text-xs text-[#94A3B8] hover:bg-[#1F2937] hover:text-[#F8FAFC] cursor-pointer transition truncate"
                >
                  <MessageSquare className="h-3.5 w-3.5 shrink-0 text-[#00D9FF]" />
                  <span className="truncate">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-[#00D9FF]/30 bg-[#00D9FF]/10 p-3 text-xs text-[#00D9FF]">
            <p className="font-bold flex items-center gap-1">
              <Sparkles className="h-3.5 w-3.5" /> Mode: Live Assist
            </p>
            <p className="text-[10px] text-[#00D9FF]/80 mt-1">Real-time database sync</p>
          </div>
        </Card>

        {/* Chat Console Window */}
        <Card className="flex flex-col h-[540px] border-[#00D9FF]/20 bg-[#030712]/90 p-4 sm:p-6 justify-between">
          {/* Messages Feed */}
          <div className="space-y-4 overflow-y-auto pr-2 flex-1">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex items-start gap-3 ${
                  msg.sender === 'user' ? 'flex-row-reverse' : ''
                }`}
              >
                <div
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border ${
                    msg.sender === 'user'
                      ? 'border-[#38BDF8]/40 bg-[#38BDF8]/20 text-[#38BDF8]'
                      : 'border-[#00D9FF]/40 bg-[#00D9FF]/20 text-[#00D9FF]'
                  }`}
                >
                  {msg.sender === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                </div>

                <div
                  className={`max-w-lg rounded-2xl p-4 text-xs leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-[#00D9FF] text-[#030712] font-medium'
                      : 'border border-[#1F2937] bg-[#111827] text-[#F8FAFC]'
                  }`}
                >
                  {msg.sender === 'ai' ? (
                    <span className="font-bold text-[#00D9FF] block mb-1">Kirana AI Co-pilot</span>
                  ) : null}
                  <p>{msg.text}</p>
                  <span
                    className={`text-[10px] mt-2 block text-right ${
                      msg.sender === 'user' ? 'text-[#030712]/70' : 'text-[#94A3B8]'
                    }`}
                  >
                    {msg.time}
                  </span>
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping ? (
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl border border-[#00D9FF]/40 bg-[#00D9FF]/20 text-[#00D9FF]">
                  <Bot className="h-4 w-4" />
                </div>
                <div className="rounded-2xl border border-[#1F2937] bg-[#111827] px-4 py-3 text-xs text-[#94A3B8] flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-[#00D9FF] animate-ping" />
                  <span>AI Co-pilot is evaluating store metrics...</span>
                </div>
              </div>
            ) : null}

            <div ref={chatEndRef} />
          </div>

          {/* Input Prompt Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleSendMessage()
            }}
            className="relative mt-4 flex items-center"
          >
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder="Ask AI co-pilot anything about inventory, sales, or supplier orders..."
              className="w-full rounded-2xl border border-[#1F2937] bg-[#111827] pl-4 pr-12 py-3.5 text-sm text-[#F8FAFC] placeholder-[#475569] outline-none transition focus:border-[#00D9FF] focus:ring-2 focus:ring-[#00D9FF]/20"
            />
            <button
              type="submit"
              disabled={!inputQuery.trim() || isTyping}
              className="absolute right-3 flex h-8 w-8 items-center justify-center rounded-xl bg-[#00D9FF] text-[#030712] transition hover:bg-[#38BDF8] disabled:opacity-40"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </Card>
      </div>
    </div>
  )
}

export default Assistant
