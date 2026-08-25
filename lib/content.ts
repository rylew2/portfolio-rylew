import { renderMarkdown } from './content/markdown';
import {
  findContentDocument,
  readContentDocuments,
} from './content/repository';
import type {
  ContentData,
  ContentListItem,
  ContentTaxonomy,
  ContentType,
} from './content/types';

export type {
  ContentData,
  ContentListItem,
  ContentTaxonomy,
  ContentType,
} from './content/types';

const sortByDate = (a: ContentListItem, b: ContentListItem): number =>
  b.date.localeCompare(a.date);

export const getContentList = (contentType: ContentType): ContentListItem[] =>
  readContentDocuments(contentType)
    .map(({ metadata }) => metadata)
    .sort(sortByDate);

export const getAllContentIds = (contentType: ContentType) =>
  getContentList(contentType).map(({ slug }) => ({ params: { id: slug } }));

export const getContentData = async (
  id: string,
  contentType: ContentType
): Promise<ContentData> => {
  const { metadata, markdown } = findContentDocument(contentType, id);

  return {
    ...metadata,
    contentHtml: await renderMarkdown(markdown),
  };
};

export const getContentTaxonomyValues = (
  contentType: ContentType,
  taxonomy: ContentTaxonomy
): string[] => {
  const values = getContentList(contentType).flatMap((item) =>
    taxonomy === 'tags' ? item.tags : item.category ? [item.category] : []
  );

  return [...new Set(values)];
};

export const getContentWithTag = (
  tag: string,
  contentType: ContentType
): ContentListItem[] =>
  getContentList(contentType).filter(({ tags }) => tags.includes(tag));

export const getContentInCategory = (
  category: string,
  contentType: ContentType
): ContentListItem[] =>
  getContentList(contentType).filter((item) => item.category === category);
