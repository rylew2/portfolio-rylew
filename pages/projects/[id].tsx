import Image from "next/image";
import { useRouter } from "next/router";
import React from "react";
import { Container, Layout } from "../../components";
import { StyledContent } from "../../components/styles/content.styles";
import { getAllContentIds, getContentData } from "../../lib/content";
import { IContentData } from "../blog/[id]";

/**
 *  Renders work markdown posts
 */

const Project = ({ projectData }) => {
  const { pathname } = useRouter();
  const { title, contentHtml, description } = projectData;

  return (
    <Layout pageTitle={title} pathname={pathname} pageDescription={description}>
      <Container width="narrow">
        <StyledContent>
          <time>{projectData.date}</time>
          {projectData.previewImage && (
            <Image src={projectData.previewImage} height={550} width={1200} />
          )}
          <blockquote>
            {projectData.liveSite && (
              <>
                <div>
                  <a
                    href={projectData.liveSite}
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    <b>Demo:</b> {projectData.liveSite}
                  </a>
                </div>
                <div>
                  <a
                    href={projectData.sourceCode}
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    <b>Source Code:</b> {projectData.sourceCode}
                  </a>
                </div>
              </>
            )}
            {projectData.presentation && (
              <div>
                <a
                  href={projectData.presentation}
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  <b>Presentation:</b> {projectData.presentation}
                </a>
              </div>
            )}
          </blockquote>
          <div dangerouslySetInnerHTML={{ __html: contentHtml }} />
        </StyledContent>
      </Container>
    </Layout>
  );
};

export const getStaticPaths = async () => {
  const paths = getAllContentIds("project");
  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps = async ({ params }) => {
  const projectData: IContentData = await getContentData(params.id, "project");
  // console.log(projectData);
  return {
    props: {
      projectData,
    },
  };
};

export default Project;
