import Link from 'next/link';
import React from 'react';
import { StyledChip } from '../styles/chips.styles';

interface ChipsProps {
  items: string[];
}

export const Chips = ({ items }: ChipsProps) => {
  return (
    <StyledChip>
      <ul>
        {items.map((tag: string, index: number) => (
          <li key={index}>
            <Link href={`tags/${tag}`}>{tag}</Link>
          </li>
        ))}
      </ul>
    </StyledChip>
  );
};
