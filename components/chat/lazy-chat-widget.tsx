import React, { useState } from 'react';

import { ChatButton, ChatContainer } from './chat-launcher.styles';

type LoadedChatWidget = React.ComponentType<{ initiallyOpen?: boolean }>;

const ChatIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z" />
  </svg>
);

const LazyChatWidget: React.FC = () => {
  const [ChatWidget, setChatWidget] = useState<LoadedChatWidget | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const loadChat = async () => {
    if (isLoading) return;

    setIsLoading(true);
    try {
      const chatModule = await import('./chat-widget');
      setChatWidget(() => chatModule.default);
    } catch {
      setIsLoading(false);
    }
  };

  if (ChatWidget) {
    return <ChatWidget initiallyOpen />;
  }

  return (
    <ChatContainer>
      <ChatButton
        type="button"
        onClick={loadChat}
        aria-label={isLoading ? 'Loading chat' : 'Open chat'}
        aria-busy={isLoading}
        disabled={isLoading}
      >
        <ChatIcon />
      </ChatButton>
    </ChatContainer>
  );
};

export default LazyChatWidget;
