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
  ChatInputFields,
  ChatInputLabel,
  ChatInput,
  CharacterCount,
  SendButton,
  LoadingDots,
  LoadingStatusText,
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
  const launcherRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const wasOpenRef = useRef(false);

  // Scroll to bottom when messages change
  useEffect(() => {
    const behavior = window.matchMedia('(prefers-reduced-motion: reduce)')
      .matches
      ? 'auto'
      : 'smooth';
    messagesEndRef.current?.scrollIntoView({ behavior });
  }, [messages, isLoading]);

  // Move focus into the dialog on open and return it to the launcher on close.
  useEffect(() => {
    if (isOpen && !wasOpenRef.current) {
      const input = inputRef.current;
      const initialFocusTarget =
        isLoading || input?.disabled ? closeButtonRef.current : input;
      initialFocusTarget?.focus();
      wasOpenRef.current = true;
    } else if (!isOpen && wasOpenRef.current) {
      launcherRef.current?.focus();
      wasOpenRef.current = false;
    }
  }, [isLoading, isOpen]);

  const handleDialogKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      setIsOpen(false);
      return;
    }

    if (event.key !== 'Tab') return;

    const focusableElements = Array.from(
      dialogRef.current?.querySelectorAll<HTMLElement>(
        'button:not(:disabled), input:not(:disabled), textarea:not(:disabled), [href], [tabindex]:not([tabindex="-1"])'
      ) ?? []
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    const activeElement = document.activeElement;

    if (
      event.shiftKey &&
      (activeElement === firstElement ||
        !dialogRef.current?.contains(activeElement))
    ) {
      event.preventDefault();
      lastElement?.focus();
    } else if (
      !event.shiftKey &&
      (activeElement === lastElement ||
        !dialogRef.current?.contains(activeElement))
    ) {
      event.preventDefault();
      firstElement?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedInput = input.trim();
    if (!trimmedInput || isLoading) return;

    // Add user message
    const userMessage: ChatMessage = { role: 'user', content: trimmedInput };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    closeButtonRef.current?.focus();
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
              "Sorry, Ryan's AI assistant is having trouble connecting right now. Please try again or contact Ryan directly via email.",
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
            "Sorry, Ryan's AI assistant could not complete that request. Please try again or contact Ryan directly via email.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ChatContainer>
      {isOpen && (
        <ChatPanel
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="chat-dialog-title"
          onKeyDown={handleDialogKeyDown}
        >
          <ChatHeader>
            <h3 id="chat-dialog-title">Chat with Ryan</h3>
            <button
              ref={closeButtonRef}
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label="Close chat"
            >
              <CloseIcon />
            </button>
          </ChatHeader>

          <ChatMessages
            role="log"
            aria-label="Chat messages"
            aria-live="polite"
            aria-relevant="additions text"
          >
            {messages.length === 0 && (
              <WelcomeMessage>
                <p>
                  <strong>Hello!</strong>
                </p>
                <p>
                  This AI assistant represents Ryan and can answer questions
                  about his projects, skills, and experience.
                </p>
              </WelcomeMessage>
            )}
            {messages.map((msg, idx) => (
              <Message key={idx} isUser={msg.role === 'user'}>
                {msg.content}
              </Message>
            ))}
            {isLoading && (
              <LoadingDots role="status">
                <LoadingStatusText>
                  Ryan&apos;s AI assistant is responding
                </LoadingStatusText>
                <span aria-hidden="true" />
                <span aria-hidden="true" />
                <span aria-hidden="true" />
              </LoadingDots>
            )}
            <div ref={messagesEndRef} />
          </ChatMessages>

          <ChatInputContainer onSubmit={handleSubmit}>
            <ChatInputFields>
              <ChatInputLabel htmlFor="chat-question">
                Your question
              </ChatInputLabel>
              <ChatInput
                ref={inputRef}
                id="chat-question"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type a message..."
                maxLength={1000}
                aria-describedby="chat-question-count"
                disabled={isLoading}
                rows={2}
              />
              <CharacterCount id="chat-question-count" aria-live="off">
                {input.length} / 1000
              </CharacterCount>
            </ChatInputFields>
            <SendButton type="submit" disabled={isLoading || !input.trim()}>
              Send
            </SendButton>
          </ChatInputContainer>
        </ChatPanel>
      )}

      {!isOpen && (
        <ChatButton
          ref={launcherRef}
          onClick={() => setIsOpen(true)}
          aria-label="Open chat"
        >
          <ChatIcon />
        </ChatButton>
      )}
    </ChatContainer>
  );
};

export default ChatWidget;
