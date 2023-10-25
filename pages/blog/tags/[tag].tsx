import { useRouter } from 'next/router'
import React from 'react'
import { Cards, Container, Layout } from '../../../components'
import tagsJSON from '../../../config/tags.json'
import { getContentWithTag } from '../../../lib/content'

const tag = ({ content, title, description }) => {
    const { pathname } = useRouter()
    return (
        <Layout
            pathname={pathname}
            pageTitle={title}
            pageDescription={description}
        >
            <Container>
                <p className="page-intro">{description}</p>

                <blockquote>
                    All blog here are for demo purposes. But hey, the sky is the
                    limit 🚀
                </blockquote>
                <Cards data={content} basePath="blog" />
            </Container>
        </Layout>
    )
}

export const getStaticPaths = async () => {
    // Get all the tags from the already defined site tags
    const paths = tagsJSON.map((tag) => {
        return {
            params: {
                tag: tag.tag,
            },
        }
    })

    return {
        paths,
        fallback: false,
    }
}

export const getStaticProps = async ({ params }) => {
    let content = getContentWithTag(params.tag, 'blog')
    const tagObject = tagsJSON.filter((json) => json.tag === params.tag)[0]

    return {
        props: {
            content,
            title: tagObject.title,
            description: tagObject.description,
        },
    }
}

export default tag
