import { useState, useEffect, useCallback, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { ChatMessage, ChatSession } from "@shared/schema";

interface ChatHookReturn {
  messages: ChatMessage[];
  isConnected: boolean;
  isLoading: boolean;
  sendMessage: (content: string) => void;
  isAdminMode: boolean;
  sessionId: string | null;
  initializeChat: () => Promise<void>;
}

export function useChat(): ChatHookReturn {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const queryClient = useQueryClient();

  const { mutateAsync: createSession } = useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/chat/session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({})
      });
      
      if (!response.ok) {
        throw new Error('Failed to create chat session');
      }
      
      return response.json() as Promise<ChatSession>;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/chat"] });
    }
  });

  const initializeChat = useCallback(async () => {
    try {
      if (sessionId) return;
      
      const session = await createSession();
      setSessionId(session.sessionId);
      
      // Connect to WebSocket
      const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
      const wsUrl = `${protocol}//${window.location.host}/ws`;
      const ws = new WebSocket(wsUrl);
      
      ws.onopen = () => {
        setIsConnected(true);
        ws.send(JSON.stringify({
          type: 'join',
          sessionId: session.sessionId
        }));
      };

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        
        switch (data.type) {
          case 'connected':
            // Send welcome message from Violet
            const welcomeMessage: ChatMessage = {
              id: 'welcome',
              sessionId: session.sessionId,
              sender: 'violet',
              message: '👋 Hi! I\'m Violet, your personal beauty assistant at Shop&Glow! I\'m here to help you discover the perfect products for your beauty routine.\n\nWhether you\'re looking for premium makeup, professional beauty tools, gentle mother care products, or luxurious pet grooming items, I\'ve got you covered!\n\nWhat brings you to Shop&Glow today?',
              messageType: 'text',
              metadata: null,
              createdAt: new Date()
            };
            setMessages([welcomeMessage]);
            break;
            
          case 'message':
            setMessages(prev => [...prev, data.message]);
            break;
            
          case 'admin_mode_activated':
            setIsAdminMode(true);
            break;
            
          case 'joined':
            console.log('Joined session:', data.sessionId);
            break;
            
          case 'error':
            console.error('WebSocket error:', data.message);
            break;
        }
      };

      ws.onclose = () => {
        setIsConnected(false);
        console.log('WebSocket disconnected');
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        setIsConnected(false);
      };

      wsRef.current = ws;
      
    } catch (error) {
      console.error('Failed to initialize chat:', error);
    }
  }, [sessionId, createSession]);

  const sendMessage = useCallback((content: string) => {
    if (!wsRef.current || !isConnected || !content.trim()) return;
    
    wsRef.current.send(JSON.stringify({
      type: 'message',
      content: content.trim()
    }));
  }, [isConnected]);

  useEffect(() => {
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  return {
    messages,
    isConnected,
    isLoading: !sessionId,
    sendMessage,
    isAdminMode,
    sessionId,
    initializeChat
  };
}