import Image from "next/image";
import { useRouter } from "next/router";
import React from "react";
import { Container, Layout } from "../../components";
import { Chips } from "../../components/chips/chips";
import { StyledContent } from "../../components/styles/content.styles";
import { getAllContentIds, getContentData } from "../../lib/content";

/**
 *  Renders articles markdown posts
 */

const Article = ({ articlesData }: { articlesData: IContentData }) => {
  const { pathname } = useRouter();
  const { title, contentHtml, description } = articlesData;

  return (
    <Layout pathname={pathname} pageTitle={title} pageDescription={description}>
      <Container width="narrow">
        <StyledContent>
          <time>{articlesData.date}</time>
          {articlesData.previewImage && (
            <Image src={articlesData.previewImage} height={550} width={1200} />
          )}
          <div dangerouslySetInnerHTML={{ __html: contentHtml }} />
          {articlesData.tags && <Chips items={articlesData.tags} />}
        </StyledContent>
      </Container>
    </Layout>
  );
};

export const getStaticPaths = async () => {
  const paths = getAllContentIds("articles");
  return {
    paths,
    fallback: false,
  };
};

export interface IContentData {
  id: string;
  contentHtml: string;
  title: string;
  date: Date;
  previewImage?: string;
  description?: string;
  tags?: string[];
  category?: string;
}

export const getStaticProps = async ({ params }) => {
  const articlesData: IContentData = await getContentData(
    params.id,
    "articles"
  );
  return {
    props: {
      articlesData,
    },
  };
};

export default Article;
