import styled from '@emotion/styled';

export const ChatContainer = styled.div`
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 1000;
  font-family: var(--font-dm-sans), 'DM Sans', sans-serif;

  @media (max-width: 560px) {
    bottom: 16px;
    right: 16px;
  }
`;

export const ChatButton = styled.button`
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: var(--chat-header-bg, #154475);
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition:
    transform var(--transition-duration, 0.25s)
      var(--transition-timing-function, cubic-bezier(0.16, 1, 0.3, 1)),
    box-shadow var(--transition-duration, 0.25s)
      var(--transition-timing-function, cubic-bezier(0.16, 1, 0.3, 1));

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
  }

  &:focus {
    outline: 2px solid var(--chat-header-bg, #154475);
    outline-offset: 2px;
  }

  &:disabled {
    cursor: wait;
  }

  svg {
    width: 24px;
    height: 24px;
    fill: white;
  }
`;
