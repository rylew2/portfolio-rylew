export type ContentType = 'book' | 'project';

export type ContentTaxonomy = 'tags' | 'category';

export type ContentPath = 'books' | 'projects';

export interface ContentListItem {
  id: string;
  path: ContentPath;
  previewImage: string;
  title: string;
  slug: string;
  date: string;
  description: string;
  tags: string[];
  category?: string;
  selectedWork?: boolean;
  liveSite?: string;
  sourceCode?: string;
  presentation?: string;
}

export interface ContentData extends ContentListItem {
  contentHtml: string;
}

export interface ContentDocument {
  metadata: ContentListItem;
  markdown: string;
}
