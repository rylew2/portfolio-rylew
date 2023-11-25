import Image from 'next/image'
import { useRouter } from 'next/router'
import React from 'react'
import { Container, Layout } from '../../components'
import { Chips } from '../../components/chips/chips'
import { StyledContent } from '../../components/styles/content.styles'
import { getAllContentIds, getContentData } from '../../lib/content'

/**
 *  Renders book markdown posts
 */

const Book = ({ bookData }: { bookData: IContentData }) => {
    const { pathname } = useRouter()
    const { title, contentHtml, description } = bookData

    return (
        <Layout
            pathname={pathname}
            pageTitle={title}
            pageDescription={description}
        >
            <Container width="narrow">
                <StyledContent>
                    <time>
                        {bookData.date instanceof Date
                            ? bookData.date.toLocaleDateString()
                            : bookData.date}
                    </time>
                    {bookData.tags && <Chips items={bookData.tags} />}
                    {bookData.previewImage && (
                        <Image
                            alt="bookimage"
                            src={bookData.previewImage}
                            height={550}
                            width={1200}
                        />
                    )}
                    <div dangerouslySetInnerHTML={{ __html: contentHtml }} />
                </StyledContent>
            </Container>
        </Layout>
    )
}

export const getStaticPaths = async () => {
    const paths = getAllContentIds('book')
    return {
        paths,
        fallback: false,
    }
}

export interface IContentData {
    id: string
    contentHtml: string
    title: string
    date: Date
    previewImage?: string
    description?: string
    tags?: string[]
    category?: string
    liveSite?: string
    sourceCode?: string
    presentation?: string
}

export const getStaticProps = async ({ params }) => {
    const bookData: IContentData = await getContentData(params.id, 'book')

    return {
        props: {
            bookData,
        },
    }
}

export default Book
