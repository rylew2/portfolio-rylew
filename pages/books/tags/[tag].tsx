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

                <Cards data={content} />
            </Container>
        </Layout>
    )
}

export const getStaticPaths = async () => {
    // Get all the tags from the already defined site tags

    console.log('getStaticPaths in [tag] file ==============> ')
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
    let content = getContentWithTag(params.tag, 'book')
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
