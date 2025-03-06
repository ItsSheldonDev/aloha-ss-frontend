"use client"

import { useState, useEffect, useRef } from 'react'
import { 
  Button,
  Card,
  Input,
  ScrollShadow,
  Avatar,
} from "@nextui-org/react"
import { MessageCircle, Send, X, Minimize2, Maximize2, Bot, User } from 'lucide-react'
import ReactMarkdown from 'react-markdown'

interface Message {
  id: string
  type: 'bot' | 'user'
  content: string
  timestamp: Date
  isTyping?: boolean
}

const initialSuggestions = [
  "Quelles sont les formations disponibles ?",
  "Comment s'inscrire à une formation ?",
  "Quel est le prix du PSC1 ?",
  "Comment devenir sauveteur ?"
];

const initialMessage: Message = {
  id: '1',
  type: 'bot',
  content: "Bonjour ! Je suis l'assistant d'Aloha Secourisme. Comment puis-je vous aider aujourd'hui ? 👋",
  timestamp: new Date()
}

const TypingAnimation = () => (
  <div className="flex space-x-2 p-2 bg-blue-100 rounded-full scale-75 opacity-75">
    <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
    <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
    <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
  </div>
);

const MessageContent = ({ message }: { message: Message }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const [showTypingAnimation, setShowTypingAnimation] = useState(true);

  useEffect(() => {
    setIsTyping(true);
    setDisplayedText('');
    setShowTypingAnimation(true);

    let i = 0;
    const text = message.content;
    
    if (message.type === 'bot' && message.isTyping) {
      // Montrer l'animation pendant un court instant avant de commencer à écrire
      const initialDelay = setTimeout(() => {
        const timer = setInterval(() => {
          if (i < text.length) {
            setDisplayedText(text.slice(0, i + 1));
            i++;
          } else {
            setIsTyping(false);
            setShowTypingAnimation(false);
            clearInterval(timer);
          }
        }, 40);

        return () => clearInterval(timer);
      }, 1000); // Délai initial pour montrer l'animation

      return () => clearTimeout(initialDelay);
    } else {
      setDisplayedText(text);
      setIsTyping(false);
      setShowTypingAnimation(false);
    }
  }, [message.content, message.type, message.isTyping]);

  return (
    <div className={`flex items-start gap-3 animate-fade-in`}>
      <Avatar
        icon={message.type === 'bot' ? <Bot className="w-5 h-5" /> : <User className="w-5 h-5" />}
        classNames={{
          base: `shrink-0 ${message.type === 'bot' ? 'bg-blue-100' : 'bg-primary'}`,
          icon: message.type === 'bot' ? 'text-blue-600' : 'text-white',
        }}
      />
      <div className={`flex-1 max-w-[85%] ${message.type === 'user' ? 'ml-auto' : ''}`}>
        <div className={`rounded-2xl px-4 py-2 shadow-sm 
          ${message.type === 'user' 
            ? 'bg-primary text-white ml-auto' 
            : 'bg-default-50 dark:bg-default-100'
          }`}
        >
          {showTypingAnimation && message.type === 'bot' && message.isTyping ? (
            <TypingAnimation />
          ) : (
            <div className="text-sm prose prose-sm max-w-none dark:prose-invert">
              <ReactMarkdown>
                {message.type === 'bot' && message.isTyping ? displayedText : message.content}
              </ReactMarkdown>
            </div>
          )}
        </div>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-[10px] text-default-400">
            {message.timestamp.toLocaleTimeString([], { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </span>
        </div>
      </div>
    </div>
  );
};

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState<Message[]>([initialMessage])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSuggestion = (suggestion: string) => {
    setInput(suggestion)
    handleSend()
  }

  const handleSend = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: input,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    const tempBotMessage: Message = {
      id: (Date.now() + 1).toString(),
      type: 'bot',
      content: '',
      timestamp: new Date(),
      isTyping: true
    }

    setMessages(prev => [...prev, tempBotMessage])

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message: input })
      })

      if (!response.ok) throw new Error('Erreur de communication')

      const data = await response.json()

      setMessages(prev => prev.map(msg => 
        msg.id === tempBotMessage.id 
          ? {
              ...msg,
              content: data.response,
              isTyping: false
            }
          : msg
      ))
    } catch (error) {
      setMessages(prev => prev.map(msg => 
        msg.id === tempBotMessage.id 
          ? {
              ...msg,
              content: "Désolé, je rencontre des difficultés techniques. Pouvez-vous réessayer ? 🤔",
              isTyping: false
            }
          : msg
      ))
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) {
    return (
      <Button
        isIconOnly
        color="primary"
        size="lg"
        radius="full"
        className="fixed bottom-6 right-6 shadow-lg z-50 animate-bounce"
        onPress={() => setIsOpen(true)}
      >
        <MessageCircle className="w-6 h-6" />
      </Button>
    )
  }

  return (
    <Card className={`fixed right-6 bottom-6 w-[380px] z-50 transition-all duration-300 
                    shadow-2xl border border-default-200
                    ${isMinimized ? 'h-14' : 'h-[600px]'}`}
    >
      {/* Header */}
      <div className="flex justify-between items-center p-4 bg-default-50 dark:bg-default-100 rounded-t-lg border-b">
        <div className="flex items-center gap-3">
          <Avatar
            icon={<Bot className="w-5 h-5" />}
            classNames={{
              base: "bg-blue-100",
              icon: "text-blue-600",
            }}
          />
          <div>
            <h3 className="text-lg font-semibold">Assistant Aloha</h3>
            <p className="text-xs text-default-500">Toujours là pour vous aider</p>
          </div>
        </div>
        <div className="flex gap-1">
          <Button
            isIconOnly
            size="sm"
            variant="light"
            onPress={() => setIsMinimized(!isMinimized)}
            className="hover:bg-default-200"
          >
            {isMinimized ? <Maximize2 size={18} /> : <Minimize2 size={18} />}
          </Button>
          <Button
            isIconOnly
            size="sm"
            variant="light"
            onPress={() => setIsOpen(false)}
            className="hover:bg-default-200"
          >
            <X size={18} />
          </Button>
        </div>
      </div>

      {/* Messages */}
      {!isMinimized && (
        <>
          <ScrollShadow className="flex-grow p-4 space-y-4 overflow-y-auto">
            {messages.map((message) => (
              <MessageContent key={message.id} message={message} />
            ))}
            {messages.length === 1 && (
              <div className="grid grid-cols-2 gap-2 mt-4 animate-fade-in">
                {initialSuggestions.map((suggestion, index) => (
                  <Button
                    key={index}
                    size="sm"
                    variant="flat"
                    color="primary"
                    className="text-xs h-auto py-2 px-3 whitespace-normal text-left justify-start"
                    onPress={() => handleSuggestion(suggestion)}
                  >
                    {suggestion}
                  </Button>
                ))}
              </div>
            )}
            <div ref={messagesEndRef} />
          </ScrollShadow>

          {/* Input */}
          <div className="p-4 border-t bg-default-50 dark:bg-default-100 rounded-b-lg">
            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleSend()
              }}
              className="flex gap-2"
            >
              <Input
                variant="bordered"
                placeholder="Tapez votre message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={isLoading}
                autoFocus
                classNames={{
                  input: "text-sm",
                  inputWrapper: "shadow-sm",
                }}
              />
              <Button
                isIconOnly
                color="primary"
                type="submit"
                isDisabled={!input.trim() || isLoading}
                isLoading={isLoading}
                className="shadow-sm"
              >
                <Send size={18} />
              </Button>
            </form>
          </div>
        </>
      )}
    </Card>
  )
}