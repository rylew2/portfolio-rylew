import Link from 'next/link';
import React from 'react';
import { StyledChip } from '../styles/chips.styles';
import tagsJSON from '../../config/tags.json';

interface ChipsProps {
  items: string[];
}

export const TAG_CATEGORIES = [
  'language',
  'framework',
  'ml',
  'practice',
  'domain',
] as const;

export type TagCategory = (typeof TAG_CATEGORIES)[number];

const FALLBACK_CATEGORY: TagCategory = 'domain';

const categoryByTag = new Map<string, TagCategory>(
  tagsJSON.map((entry) => [entry.tag, entry.category as TagCategory]),
);

// A tag added to a markdown file but not yet to config/tags.json falls back to
// the neutral category rather than rendering unstyled. tag-pages.spec.ts turns
// that omission into a test failure so it can't go unnoticed.
export const getTagCategory = (tag: string): TagCategory =>
  categoryByTag.get(tag) ?? FALLBACK_CATEGORY;

export const Chips = ({ items }: ChipsProps) => {
  return (
    <StyledChip>
      <ul>
        {items.map((tag: string, index: number) => (
          <li key={index} className={getTagCategory(tag)}>
            <Link href={`tags/${tag}`}>{tag}</Link>
          </li>
        ))}
      </ul>
    </StyledChip>
  );
};
