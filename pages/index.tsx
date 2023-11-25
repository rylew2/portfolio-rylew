import React, { FC } from 'react'
import { Cards, Container, Layout } from '../components'
import { StyledIndexPage } from '../components/styles/home.styles'
import { getContentList } from '../lib/content'

/**
 * Index page `/index`
 */

//@ts-ignore
const Index: FC = ({ selectedProjects }) => {
    return (
        <Layout pathname={'/'} pageTitle="Ryan Lewis Portfolio">
            <StyledIndexPage>
                <Container>
                    <Cards data={selectedProjects} basePath="projects" />
                </Container>
            </StyledIndexPage>
        </Layout>
    )
}

export const getStaticProps = async () => {
    const projects = await getContentList('project')
    const books = await getContentList('book')
    const selectedProjects = projects.filter((work) => work.selectedWork)
    const selectedBooks = books.filter((book) => book.selectedWork);

    const selectedWorks = [...selectedProjects, ...selectedBooks];


    return {
        props: {
            selectedProjects:selectedWorks
        },
    }
}

export default Index
