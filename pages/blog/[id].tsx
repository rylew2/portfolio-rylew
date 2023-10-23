import Image from "next/image";
import { useRouter } from "next/router";
import React from "react";
import { Container, Layout } from "../../components";
import { Chips } from "../../components/chips/chips";
import { StyledContent } from "../../components/styles/content.styles";
import { getAllContentIds, getContentData } from "../../lib/content";

/**
 *  Renders blog markdown posts
 */

const Blog = ({ blogData }: { blogData: IContentData }) => {
  const { pathname } = useRouter();
  const { title, contentHtml, description } = blogData;

  return (
    <Layout pathname={pathname} pageTitle={title} pageDescription={description}>
      <Container width="narrow">
        <StyledContent>
        {/* <time>{blogData.date instanceof Date ? blogData.date.toLocaleDateString() : blogData.date}</time> */}
          {blogData.tags && <Chips items={blogData.tags} />}
          {blogData.previewImage && (
            <Image alt="blogimage" src={blogData.previewImage} height={550} width={1200} />
          )}
          <div dangerouslySetInnerHTML={{ __html: contentHtml }} />
        </StyledContent>
      </Container>
    </Layout>
  );
};

export const getStaticPaths = async () => {
  const paths = getAllContentIds("blog");
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
  liveSite?: string;
  sourceCode?: string;
  presentation?: string;
}

export const getStaticProps = async ({ params }) => {
  const blogData: IContentData = await getContentData(params.id, "blog");

  return {
    props: {
      blogData,
    },
  };
};

export default Blog;
