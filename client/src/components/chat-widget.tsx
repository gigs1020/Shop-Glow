import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { useChat } from "@/hooks/use-chat";
import { 
  MessageCircle, 
  X, 
  Send, 
  Minimize2,
  Maximize2,
  Shield,
  Sparkles,
  User,
  Crown
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { ChatMessage } from "@shared/schema";

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [hasNewMessage, setHasNewMessage] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const { 
    messages, 
    isConnected, 
    isLoading, 
    sendMessage, 
    isAdminMode, 
    initializeChat 
  } = useChat();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (!isOpen && messages.length > 1) {
      setHasNewMessage(true);
    }
  }, [messages, isOpen]);

  useEffect(() => {
    if (isOpen) {
      setHasNewMessage(false);
      inputRef.current?.focus();
    }
  }, [isOpen]);

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;
    sendMessage(inputValue);
    setInputValue("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleOpen = () => {
    setIsOpen(true);
    if (!messages.length && !isLoading) {
      initializeChat();
    }
  };

  const formatMessageTime = (date: Date) => {
    return new Date(date).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const renderMessage = (message: ChatMessage) => {
    const isViolet = message.sender === 'violet';
    const isUser = message.sender === 'user';
    
    return (
      <motion.div
        key={message.id}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn(
          "flex items-start gap-3 p-4",
          isUser ? "flex-row-reverse" : "flex-row"
        )}
        data-testid={`chat-message-${message.id}`}
      >
        {/* Avatar */}
        <div className={cn(
          "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
          isViolet 
            ? "bg-gradient-to-br from-purple-500 to-emerald-500 text-white" 
            : "bg-gray-200 text-gray-600"
        )}>
          {isViolet ? <Sparkles className="w-4 h-4" /> : <User className="w-4 h-4" />}
        </div>

        {/* Message bubble */}
        <div className={cn(
          "max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed",
          isUser
            ? "bg-gradient-to-br from-royal-purple to-emerald-accent text-white"
            : "bg-white border border-gray-200 text-gray-800 shadow-sm"
        )}>
          {/* Admin mode indicator */}
          {isViolet && isAdminMode && (
            <div className="flex items-center gap-2 mb-2 text-xs">
              <Crown className="w-3 h-3 text-yellow-500" />
              <Badge variant="outline" className="text-xs bg-yellow-50 text-yellow-700 border-yellow-200">
                Admin Mode
              </Badge>
            </div>
          )}
          
          <div className="whitespace-pre-wrap">
            {message.message}
          </div>
          
          <div className={cn(
            "text-xs mt-2 opacity-70",
            isUser ? "text-white/70" : "text-gray-500"
          )}>
            {formatMessageTime(message.createdAt || new Date())}
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <>
      {/* Chat Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            className="fixed bottom-6 right-6 z-50"
          >
            <Button
              onClick={handleOpen}
              className={cn(
                "w-16 h-16 rounded-full shadow-2xl",
                "bg-gradient-to-br from-royal-purple to-emerald-accent",
                "hover:shadow-3xl transform hover:scale-110 transition-all duration-300",
                "flex items-center justify-center relative"
              )}
              data-testid="chat-open-button"
            >
              <MessageCircle className="w-6 h-6 text-white" />
              {hasNewMessage && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white"
                />
              )}
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            className={cn(
              "fixed z-50 bg-white rounded-t-2xl shadow-2xl border",
              "bottom-0 right-0 left-0", // Mobile: full width
              "md:bottom-6 md:right-6 md:left-auto", // Desktop: positioned
              "md:w-96 md:rounded-2xl", // Desktop: fixed width and rounded
              isMinimized ? "h-16" : "h-[600px] md:h-[500px]" // Responsive height
            )}
            data-testid="chat-widget-container"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-royal-purple to-emerald-accent text-white rounded-t-2xl">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-semibold flex items-center gap-2">
                    Violet
                    {isAdminMode && <Crown className="w-4 h-4 text-yellow-300" />}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-white/80">
                    <div className={cn(
                      "w-2 h-2 rounded-full",
                      isConnected ? "bg-green-400" : "bg-red-400"
                    )} />
                    {isConnected ? "Online" : "Connecting..."}
                    {isAdminMode && (
                      <Badge variant="outline" className="text-xs bg-yellow-500/20 text-yellow-200 border-yellow-300/30">
                        Admin
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="text-white/80 hover:text-white hover:bg-white/10 w-8 h-8 p-0"
                  data-testid="chat-minimize-button"
                >
                  {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                  className="text-white/80 hover:text-white hover:bg-white/10 w-8 h-8 p-0"
                  data-testid="chat-close-button"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Chat Content */}
            {!isMinimized && (
              <>
                {/* Messages */}
                <ScrollArea className="flex-1 h-[calc(100%-140px)]">
                  <div className="p-2">
                    {messages.length === 0 && !isLoading && (
                      <div className="flex items-center justify-center h-32 text-gray-500">
                        <div className="text-center">
                          <Sparkles className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                          <p className="text-sm">Start a conversation with Violet!</p>
                        </div>
                      </div>
                    )}
                    
                    {isLoading && (
                      <div className="flex items-center justify-center h-32">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-royal-purple" />
                      </div>
                    )}
                    
                    {messages.map(renderMessage)}
                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>

                {/* Input Area */}
                <div className="p-4 border-t bg-gray-50">
                  <div className="flex gap-2">
                    <Input
                      ref={inputRef}
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Type your message..."
                      className="flex-1 border-gray-200 focus:border-royal-purple"
                      disabled={!isConnected}
                      data-testid="chat-input"
                    />
                    <Button
                      onClick={handleSendMessage}
                      disabled={!isConnected || !inputValue.trim()}
                      className="bg-gradient-to-br from-royal-purple to-emerald-accent hover:opacity-90 px-4"
                      data-testid="chat-send-button"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  {!isConnected && (
                    <p className="text-xs text-red-500 mt-2">
                      Connection lost. Please refresh the page.
                    </p>
                  )}
                  
                  {isAdminMode && (
                    <div className="flex items-center gap-2 mt-2 p-2 bg-yellow-50 rounded-lg border border-yellow-200">
                      <Shield className="w-4 h-4 text-yellow-600" />
                      <p className="text-xs text-yellow-700">
                        Admin mode active - Advanced features available
                      </p>
                    </div>
                  )}
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}