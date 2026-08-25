import fs from 'node:fs';
import path from 'node:path';

import matter from 'gray-matter';

import type {
  ContentDocument,
  ContentListItem,
  ContentPath,
  ContentType,
} from './types';

const DEFAULT_PREVIEW_IMAGE = '/images/image-placeholder.png';

const contentPaths: Record<ContentType, ContentPath> = {
  book: 'books',
  project: 'projects',
};

const getContentDirectory = (contentType: ContentType): string =>
  path.join(process.cwd(), 'content', contentType);

const readRequiredString = (
  data: Record<string, unknown>,
  field: 'title' | 'slug' | 'date',
  sourcePath: string
): string => {
  const value = data[field];
  if (typeof value !== 'string' || value.trim().length === 0) {
    throw new Error(`${sourcePath} requires a non-empty ${field}`);
  }

  return value;
};

const readOptionalString = (
  data: Record<string, unknown>,
  field: string
): string | undefined => {
  const value = data[field];
  return typeof value === 'string' && value.length > 0 ? value : undefined;
};

const readTags = (
  data: Record<string, unknown>,
  sourcePath: string
): string[] => {
  const value = data.tags;
  if (value === undefined) {
    return [];
  }

  if (!Array.isArray(value) || value.some((tag) => typeof tag !== 'string')) {
    throw new Error(`${sourcePath} tags must be an array of strings`);
  }

  return value;
};

const normalizeMetadata = (
  data: Record<string, unknown>,
  contentType: ContentType,
  sourcePath: string
): ContentListItem => {
  const slug = readRequiredString(data, 'slug', sourcePath);
  const category = readOptionalString(data, 'category');
  const liveSite = readOptionalString(data, 'liveSite');
  const sourceCode = readOptionalString(data, 'sourceCode');
  const presentation = readOptionalString(data, 'presentation');

  return {
    id: slug,
    path: contentPaths[contentType],
    title: readRequiredString(data, 'title', sourcePath),
    slug,
    date: readRequiredString(data, 'date', sourcePath),
    description: readOptionalString(data, 'description') ?? '',
    previewImage:
      readOptionalString(data, 'previewImage') ?? DEFAULT_PREVIEW_IMAGE,
    tags: readTags(data, sourcePath),
    ...(category ? { category } : {}),
    ...(typeof data.selectedWork === 'boolean'
      ? { selectedWork: data.selectedWork }
      : {}),
    ...(liveSite ? { liveSite } : {}),
    ...(sourceCode ? { sourceCode } : {}),
    ...(presentation ? { presentation } : {}),
  };
};

export const readContentDocuments = (
  contentType: ContentType
): ContentDocument[] => {
  const directory = getContentDirectory(contentType);
  const documents = fs
    .readdirSync(directory)
    .filter((filename) => filename.endsWith('.md'))
    .sort()
    .map((filename) => {
      const sourcePath = path.join(directory, filename);
      const parsed = matter(fs.readFileSync(sourcePath, 'utf8'));

      return {
        metadata: normalizeMetadata(parsed.data, contentType, sourcePath),
        markdown: parsed.content,
      };
    });

  const slugs = new Set<string>();
  for (const { metadata } of documents) {
    if (slugs.has(metadata.slug)) {
      throw new Error(
        `Duplicate ${contentType} content slug: ${metadata.slug}`
      );
    }
    slugs.add(metadata.slug);
  }

  return documents;
};

export const findContentDocument = (
  contentType: ContentType,
  slug: string
): ContentDocument => {
  const document = readContentDocuments(contentType).find(
    ({ metadata }) => metadata.slug === slug
  );

  if (!document) {
    throw new Error(`Unknown ${contentType} content slug: ${slug}`);
  }

  return document;
};
