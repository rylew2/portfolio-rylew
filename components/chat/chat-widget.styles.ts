import styled from '@emotion/styled';

export const ChatContainer = styled.div`
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 1000;
  font-family: 'DM Sans', sans-serif;

  @media (max-width: 560px) {
    bottom: 16px;
    right: 16px;
  }
`;

export const ChatButton = styled.button`
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: var(--prim-color, #154475);
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition: transform var(--transition-duration, 0.25s)
      var(--transition-timing-function, cubic-bezier(0.16, 1, 0.3, 1)),
    box-shadow var(--transition-duration, 0.25s)
      var(--transition-timing-function, cubic-bezier(0.16, 1, 0.3, 1));

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
  }

  &:focus {
    outline: 2px solid var(--prim-color, #154475);
    outline-offset: 2px;
  }

  svg {
    width: 24px;
    height: 24px;
    fill: white;
  }
`;

export const ChatPanel = styled.div`
  position: absolute;
  bottom: 70px;
  right: 0;
  width: 380px;
  height: 500px;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  animation: slideUp 0.25s var(--transition-timing-function, cubic-bezier(0.16, 1, 0.3, 1));

  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @media (max-width: 560px) {
    position: fixed;
    bottom: 0;
    right: 0;
    left: 0;
    width: 100%;
    height: 100%;
    max-height: 100vh;
    border-radius: 0;
  }
`;

export const ChatHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  background: var(--prim-color, #154475);
  color: white;

  h3 {
    margin: 0;
    font-family: 'Manrope', sans-serif;
    font-size: 1rem;
    font-weight: 700;
  }

  button {
    background: transparent;
    border: none;
    cursor: pointer;
    padding: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 4px;
    transition: background 0.2s;

    &:hover {
      background: rgba(255, 255, 255, 0.1);
    }

    svg {
      width: 20px;
      height: 20px;
      stroke: white;
    }
  }
`;

export const ChatMessages = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  background: #f8f9fa;
`;

export const Message = styled.div<{ isUser: boolean }>`
  max-width: 85%;
  padding: 10px 14px;
  border-radius: 12px;
  font-size: 0.9rem;
  line-height: 1.4;
  word-wrap: break-word;
  align-self: ${(props) => (props.isUser ? 'flex-end' : 'flex-start')};
  background: ${(props) => (props.isUser ? 'var(--prim-color, #154475)' : '#ffffff')};
  color: ${(props) => (props.isUser ? 'white' : 'var(--text-color, #161b2f)')};
  box-shadow: ${(props) =>
    props.isUser ? 'none' : '0 1px 3px rgba(0, 0, 0, 0.1)'};
`;

export const WelcomeMessage = styled.div`
  text-align: center;
  color: var(--text-color-dark, #777);
  font-size: 0.85rem;
  padding: 20px;

  p {
    margin: 0 0 8px 0;
  }

  strong {
    color: var(--text-color, #161b2f);
  }
`;

export const ChatInputContainer = styled.form`
  display: flex;
  gap: 8px;
  padding: 12px 16px;
  border-top: 1px solid #e9ecef;
  background: white;
`;

export const ChatInput = styled.input`
  flex: 1;
  padding: 10px 14px;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  font-size: 0.9rem;
  font-family: 'DM Sans', sans-serif;
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: var(--prim-color, #154475);
  }

  &:disabled {
    background: #f8f9fa;
    cursor: not-allowed;
  }
`;

export const SendButton = styled.button`
  padding: 10px 16px;
  background: var(--prim-color, #154475);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 600;
  font-family: 'DM Sans', sans-serif;
  transition: background 0.2s, transform 0.1s;

  &:hover:not(:disabled) {
    background: #0d3259;
  }

  &:active:not(:disabled) {
    transform: scale(0.98);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const LoadingDots = styled.div`
  display: flex;
  gap: 4px;
  padding: 10px 14px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  align-self: flex-start;

  span {
    width: 8px;
    height: 8px;
    background: var(--prim-color, #154475);
    border-radius: 50%;
    animation: bounce 1.4s ease-in-out infinite;

    &:nth-of-type(1) {
      animation-delay: 0s;
    }
    &:nth-of-type(2) {
      animation-delay: 0.2s;
    }
    &:nth-of-type(3) {
      animation-delay: 0.4s;
    }
  }

  @keyframes bounce {
    0%,
    80%,
    100% {
      transform: translateY(0);
    }
    40% {
      transform: translateY(-6px);
    }
  }
`;
