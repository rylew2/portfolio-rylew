import React from "react";
import { Cards, Container, Layout } from "../components";
import { getContentList } from "../lib/content";

/**
 * Blog page `/blog`
 */

const Blog = ({ blog }) => {
  return (
    <Layout
      pathname={"/blog"}
      pageTitle="Blog"
      pageDescription="blog and Essays about Frontend Web Development and software engineering"
    >
      <Container>
        <p className="page-intro">
          More long form blog and essays about new things I'm exploring and
          learning about...
        </p>

        <blockquote>More blogs coming soon April 2021 🚀</blockquote>
        <Cards data={blog} basePath="blog" />
      </Container>
    </Layout>
  );
};

//getStaticProps run only at build time
// in dev, run on every request
export const getStaticProps = async () => {
  const blog = getContentList("blog");
  return {
    props: { blog },
  };
};

export default Blog;
