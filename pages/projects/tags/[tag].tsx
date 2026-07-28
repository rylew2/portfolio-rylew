import React from 'react';
import { GetStaticPropsContext } from 'next';
import { Cards, Container, Layout } from '../../../components';
import tagsJSON from '../../../config/tags.json';
import { getContentWithTag, ContentListItem } from '../../../lib/content';

interface TagPageProps {
  content: ContentListItem[];
  title: string;
  description: string;
  tag: string;
}

const Tag = ({ content, title, description, tag }: TagPageProps) => {
  return (
    <Layout
      canonicalPath={`/projects/tags/${encodeURIComponent(tag)}`}
      pageTitle={title}
      pageDescription={description}
    >
      <Container>
        <p className="page-intro">{description}</p>

        <Cards data={content} />
      </Container>
    </Layout>
  );
};

export const getStaticPaths = async () => {
  // Get all the tags from the already defined site tags

  const paths = tagsJSON.map((tag) => {
    return {
      params: {
        tag: tag.tag,
      },
    };
  });

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps = async ({ params }: GetStaticPropsContext) => {
  const tag = params?.tag as string;
  const content = getContentWithTag(tag, 'project');
  const tagObject = tagsJSON.filter((json) => json.tag === tag)[0];

  return {
    props: {
      content,
      title: tagObject.title,
      description: tagObject.description,
      tag,
    },
  };
};

export default Tag;
