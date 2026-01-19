import React, { useState, useRef, useEffect } from 'react';
import {
  ChatContainer,
  ChatButton,
  ChatPanel,
  ChatHeader,
  ChatMessages,
  Message,
  WelcomeMessage,
  ChatInputContainer,
  ChatInput,
  SendButton,
  LoadingDots,
} from './chat-widget.styles';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

const ChatIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z" />
  </svg>
);

const CloseIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M18 6L6 18M6 6l12 12" />
  </svg>
);

const ChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Focus input when panel opens
  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedInput = input.trim();
    if (!trimmedInput || isLoading) return;

    // Add user message
    const userMessage: ChatMessage = { role: 'user', content: trimmedInput };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: trimmedInput,
          history: messages,
        }),
      });

      const data = await response.json();

      if (data.error) {
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content:
              "Sorry, I'm having trouble connecting right now. Please try again or reach out to me directly via email!",
          },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          { role: 'assistant', content: data.response },
        ]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content:
            "Sorry, something went wrong. Please try again or reach out to me directly via email!",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ChatContainer>
      {isOpen && (
        <ChatPanel>
          <ChatHeader>
            <h3>Chat with Ryan</h3>
            <button onClick={() => setIsOpen(false)} aria-label="Close chat">
              <CloseIcon />
            </button>
          </ChatHeader>

          <ChatMessages>
            {messages.length === 0 && (
              <WelcomeMessage>
                <p>
                  <strong>Hi there!</strong>
                </p>
                <p>
                  I'm an AI assistant representing Ryan. Ask me about his
                  projects, skills, experience, or anything else!
                </p>
              </WelcomeMessage>
            )}
            {messages.map((msg, idx) => (
              <Message key={idx} isUser={msg.role === 'user'}>
                {msg.content}
              </Message>
            ))}
            {isLoading && (
              <LoadingDots>
                <span />
                <span />
                <span />
              </LoadingDots>
            )}
            <div ref={messagesEndRef} />
          </ChatMessages>

          <ChatInputContainer onSubmit={handleSubmit}>
            <ChatInput
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message..."
              disabled={isLoading}
            />
            <SendButton type="submit" disabled={isLoading || !input.trim()}>
              Send
            </SendButton>
          </ChatInputContainer>
        </ChatPanel>
      )}

      <ChatButton
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? 'Close chat' : 'Open chat'}
      >
        <ChatIcon />
      </ChatButton>
    </ChatContainer>
  );
};

export default ChatWidget;
