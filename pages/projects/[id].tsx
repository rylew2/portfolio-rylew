import { faChrome, faYoutube } from '@fortawesome/free-brands-svg-icons'
import { faCode } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Image from 'next/image'
import { useRouter } from 'next/router'
import React from 'react'
import { Container, Layout } from '../../components'
import { Chips } from '../../components/chips/chips'
import { StyledContent } from '../../components/styles/content.styles'
import { getAllContentIds, getContentData } from '../../lib/content'
import { IContentData } from '../books/[id]'
import { IconProp } from '@fortawesome/fontawesome-svg-core'
/**
 *  Renders work markdown posts
 */

const Project = ({ projectData }) => {
    const { pathname } = useRouter()
    const { title, contentHtml, description } = projectData
    return (
        <Layout
            pageTitle={title}
            pathname={pathname}
            pageDescription={description}
        >
            <Container width="narrow">
                <StyledContent>
                    <time>
                        {projectData.date instanceof Date
                            ? projectData.date.toLocaleDateString()
                            : projectData.date}
                    </time>
                    {projectData.tags && <Chips items={projectData.tags} />}
                    {projectData.previewImage && (
                        <Image
                            alt="projectimage"
                            src={projectData.previewImage}
                            height={550}
                            width={1200}
                        />
                    )}
                    <blockquote>
                        {projectData.liveSite && (
                            <div>
                                <a
                                    href={projectData.liveSite}
                                    target="_blank"
                                    rel="noreferrer noopener"
                                >
                                    <FontAwesomeIcon
                                        color="blue"
                                        icon={faChrome as IconProp}
                                        style={{
                                            width: '25px',
                                            verticalAlign: 'middle',
                                        }}
                                    />{' '}
                                    <b>Demo:</b> {projectData.liveSite}
                                </a>
                            </div>
                        )}

                        {projectData.sourceCode && (
                            <div>
                                <a
                                    href={projectData.sourceCode}
                                    target="_blank"
                                    rel="noreferrer noopener"
                                    style={{ display: 'inline-block' }}
                                >
                                    <FontAwesomeIcon
                                        color="green"
                                        icon={faCode}
                                        style={{
                                            width: '25px',
                                            verticalAlign: 'middle',
                                        }}
                                    />{' '}
                                    <b>Source Code:</b> {projectData.sourceCode}
                                </a>
                            </div>
                        )}
                        {projectData.presentation && (
                            <div>
                                <a
                                    href={projectData.presentation}
                                    target="_blank"
                                    rel="noreferrer noopener"
                                >
                                    <FontAwesomeIcon
                                        color={'Tomato'}
                                        icon={faYoutube as IconProp}
                                        style={{
                                            width: '25px',
                                            verticalAlign: 'middle',
                                        }}
                                    />{' '}
                                    <b>Presentation:</b>{' '}
                                    {projectData.presentation}
                                </a>
                            </div>
                        )}
                    </blockquote>
                    <div dangerouslySetInnerHTML={{ __html: contentHtml }} />
                </StyledContent>
            </Container>
        </Layout>
    )
}

export const getStaticPaths = async () => {
    const paths = getAllContentIds('project')
    return {
        paths,
        fallback: false,
    }
}

export const getStaticProps = async ({ params }) => {
    const projectData: IContentData = await getContentData(params.id, 'project')

    return {
        props: {
            projectData,
        },
    }
}

export default Project
