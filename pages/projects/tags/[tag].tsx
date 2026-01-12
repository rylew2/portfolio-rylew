import { useRouter } from 'next/router';
import React from 'react';
import { GetStaticPropsContext } from 'next';
import { Cards, Container, Layout } from '../../../components';
import tagsJSON from '../../../config/tags.json';
import { getContentWithTag, ContentListItem } from '../../../lib/content';

interface TagPageProps {
  content: ContentListItem[];
  title: string;
  description: string;
}

const Tag = ({ content, title, description }: TagPageProps) => {
  const { pathname } = useRouter();
  return (
    <Layout pathname={pathname} pageTitle={title} pageDescription={description}>
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
  const content = getContentWithTag(params?.tag as string, 'project');
  const tagObject = tagsJSON.filter((json) => json.tag === params?.tag)[0];

  return {
    props: {
      content,
      title: tagObject.title,
      description: tagObject.description,
    },
  };
};

export default Tag;
