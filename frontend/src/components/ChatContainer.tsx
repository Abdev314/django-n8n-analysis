import { useEffect, useRef, useState } from 'react';
import { Sparkles } from 'lucide-react';
import { ChatInput } from './ChatInput';
import { MessageBubble } from './MessageBubble';

interface ChatMessage {
  id: string;
  content: string;
  isUser: boolean;
}

const initialMessages: ChatMessage[] = [
  {
    id: 'welcome',
    content: 'Welcome! Ask me anything about PDF analysis or the workflow and I’ll help you get started.',
    isUser: false,
  },
];

// Define the two webhook endpoints
const PDF_API_URL = 'http://localhost:5678/webhook/pdf-analyze';
const TXT_API_URL = 'http://localhost:5678/webhook/arduino';

// Helper to choose the correct URL based on file extension
const getApiUrl = (file?: File): string => {
  if (!file) return PDF_API_URL; // default to PDF endpoint if no file
  const ext = file.name.split('.').pop()?.toLowerCase();
  if (ext === 'txt') return TXT_API_URL;
  if (ext === 'pdf') return PDF_API_URL;
  return PDF_API_URL; // fallback for other types
};

export const ChatContainer = () => {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (message: string, file?: File) => {
    if ((!message && !file) || isSending) return;

    if (message) {
      setMessages(prev => [...prev, { id: `${Date.now()}-user`, content: message, isUser: true }]);
    }
    if (file) {
      setMessages(prev => [...prev, { id: `${Date.now()}-file`, content: `📎 Uploaded file: ${file.name}`, isUser: true }]);
    }

    setIsSending(true);

    try {
      const formData = new FormData();
      if (file) formData.append('data', file);
      if (message) formData.append('message', message);

      // Dynamically select the correct endpoint
      const apiUrl = getApiUrl(file);
      console.log(`Sending to: ${apiUrl}`);

      const response = await fetch(apiUrl, { method: 'POST', body: formData });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const contentType = response.headers.get('content-type');
      let botReply = '';

      if (contentType && contentType.includes('application/json')) {
        const data = await response.json();
        console.log('n8n JSON response:', data);

        let responseData = data;
        if (Array.isArray(data) && data.length > 0) {
          responseData = data[0];
        }

        botReply = responseData?.message?.content ||
                  responseData?.content ||
                  responseData?.output ||
                  responseData?.result ||
                  responseData?.message ||
                  responseData?.reply;

        if (!botReply) {
          botReply = JSON.stringify(responseData, null, 2);
          if (botReply.length > 500) botReply = botReply.substring(0, 500) + '…';
        }
      } else {
        botReply = await response.text();
        if (botReply.length > 1000) botReply = botReply.substring(0, 1000) + '…\n(truncated)';
      }

      setMessages(prev => [...prev, { id: `${Date.now()}-bot`, content: botReply, isUser: false }]);
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, { id: `${Date.now()}-error`, content: '⚠️ Failed to get a response. Please try again later.', isUser: false }]);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[600px]">
      <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100 bg-white shrink-0">
        <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-lg font-semibold text-gray-800">AI Assistant</h1>
          <p className="text-xs text-gray-500">Always here to help</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-4 bg-gray-50/50">
        <div className="space-y-3">
          {messages.map((message) => (
            <MessageBubble
              key={message.id}
              content={message.content}
              isUser={message.isUser}
            />
          ))}
        </div>
        <div ref={messagesEndRef} />
      </div>

      <ChatInput onSendMessage={handleSendMessage} isSending={isSending} />
      {isSending && (
        <div className="px-6 py-3 text-xs text-gray-500 bg-gray-50 border-t border-gray-100">
          Processing...
        </div>
      )}
    </div>
  );
};