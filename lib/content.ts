import fs from 'fs'
import matter from 'gray-matter'
import path from 'path'
import remark from 'remark'
import html from 'remark-html'
import remarkPrism from 'remark-prism'
import { v4 as uuid } from 'uuid'
import { IContentData } from '../pages/books/[id]'
// import { IContentData } from '../pages/blog/[id]'

const projectDirectory = path.join(process.cwd(), 'content', 'project')
const bookDirectory = path.join(process.cwd(), 'content', 'book')

type IContentType = 'book' | 'project'

/**
 * Get IDs of all markdown post
 * @param {string} contentType Type of content to get ids
 * Called from getStaticPaths of the [id].tsx page
 */
export const getAllContentIds = (contentType: IContentType) => {
    let filenames
    let baseDir

    // determine where to look for content types
    switch (contentType) {
        case 'book':
            baseDir = bookDirectory
            filenames = fs.readdirSync(bookDirectory)
            break

        case 'project':
            baseDir = projectDirectory
            filenames = fs.readdirSync(projectDirectory)
            break

        default:
            throw new Error('You have to provide a content type')
    }

    // return the slug of all the content IDs
    return filenames.map((filename) => {
        const filePath = path.join(baseDir, filename)
        const fileContent = fs.readFileSync(filePath, 'utf-8')

        //convert string at the start of each .md into
        //an object {content: .., data: title:..., slug: ..}
        const matterResult = matter(fileContent)

        return {
            params: {
                // This is where we switch it up to use slug instead of the filename for generating pages
                // id: filename.replace(/\.md$/, ""),
                id: matterResult.data.slug,
            },
        }
    })
}

/**
 * Get data for a given post id
 * @param {string} id ID of the post being passed
 * @param {string} contentType Type of content
 * Called from getStaticProps of the [id].tsx
 */
export const getContentData = async (id: string, contentType: IContentType) => {
    let contentTypeDirectory
    let filenames
    switch (contentType) {
        case 'book':
            filenames = fs.readdirSync(bookDirectory)
            contentTypeDirectory = bookDirectory
            break

        case 'project':
            filenames = fs.readdirSync(projectDirectory)
            contentTypeDirectory = projectDirectory
            break

        default:
            throw new Error('You have to provide a content type')
    }

    // loop through all the content types and compare the slug to get the filename
    const match = filenames.filter((filename) => {
        const filePath = path.join(contentTypeDirectory, filename)

        const fileContent = fs.readFileSync(filePath, 'utf-8')
        const matterResult = matter(fileContent)
        const { slug } = matterResult.data

        return slug === id
    })

    // use the returned path to get the fullpath and read the file content
    const fullPath = path.join(contentTypeDirectory, match[0])
    // const fullPath = path.join(contentTypeDirectory, `${id}.md`);
    const fileContents = fs.readFileSync(fullPath, 'utf-8')

    const matterResult = matter(fileContents)
    const processedContent = await remark()
        .use(html)
        .use(remarkPrism)
        .process(matterResult.content)

    const contentHtml = processedContent.toString()

    return {
        id,
        contentHtml,
        title: matterResult.data.title,
        date: matterResult.data.date,
        previewImage: matterResult.data.previewImage || '',
        description: matterResult.data.description || '',
        tags: matterResult.data.tags || [],
        category: matterResult.data.category || '',
        liveSite: matterResult.data.liveSite || '',
        sourceCode: matterResult.data.sourceCode || '',
        presentation: matterResult.data.presentation || '',
    }
}

/**
 * Get content list for a particular content type
 * @param {string} contentType Type of content
 * For the landing page of each subpage - called from book/project.tsx getStaticProps
 */
export const getContentList = (contentType: IContentType) => {
    let contentFiles
    let contentDir

    switch (contentType) {
        case 'project':
            contentFiles = fs.readdirSync(projectDirectory)
            contentDir = projectDirectory
            break

        case 'book':
            contentFiles = fs.readdirSync(bookDirectory)
            contentDir = bookDirectory
            break
    }

    const content = contentFiles
        .filter((content) => content.endsWith('.md'))
        .map((content) => {
            const path = `${contentDir}/${content}`
            const rawContent = fs.readFileSync(path, {
                encoding: 'utf-8',
            })
            const { data } = matter(rawContent)

            return {
                ...data,
                previewImage:
                    data.previewImage || '/images/image-placeholder.png',
                id: uuid(),
            }
        })

    return content.sort(sortByDate)
}

/**
 * Get content type with particular tag
 * @param {string} tag - tag to filter by
 * called from [id].tsx getStaticPaths
 */
export const getContentWithTag = (tag: string, contentType: IContentType) => {
    let contentDir
    let contentFiles

    switch (contentType) {
        case 'book':
            contentDir = bookDirectory
            break

        case 'project':
            contentDir = projectDirectory
            break
    }

    contentFiles = fs.readdirSync(contentDir)

    let contentData = contentFiles
        .filter((content) => content.endsWith('.md'))
        .map((content) => {
            const path = `${contentDir}/${content}`
            const rawContent = fs.readFileSync(path, {
                encoding: 'utf-8',
            })

            const { data } = matter(rawContent)

            return {
                ...data,
                previewImage:
                    data.previewImage || '/images/image-placeholder.png',
                id: uuid(),
            }
        })

    const filteredContent = contentData.filter((content: IContentData) => {
        return content.tags && content.tags.includes(tag)
    })

    return filteredContent.sort(sortByDate)
}

/**
 * Get content type with particular tag
 * @param {string} tag - tag to filter by
 */
export const getContentInCategory = (
    category: string,
    contentType: IContentType
) => {
    let contentDir
    let contentFiles

    switch (contentType) {
        case 'book':
            contentDir = bookDirectory
            break

        case 'project':
            contentDir = projectDirectory
            break
    }

    contentFiles = fs.readdirSync(contentDir)

    let contentData = contentFiles
        .filter((content) => content.endsWith('.md'))
        .map((content) => {
            const path = `${contentDir}/${content}`
            const rawContent = fs.readFileSync(path, {
                encoding: 'utf-8',
            })

            const { data } = matter(rawContent)

            return {
                ...data,
                previewImage:
                    data.previewImage || '/images/image-placeholder.png',
                id: uuid(),
            }
        })

    const filteredContent = contentData.filter((content: IContentData) => {
        return content.category && content.category === category
    })

    return filteredContent.sort(sortByDate)
}

/**
 * Sorts content by their dates
 * @param a {date.toLocaleDateString()} - Date of post 1
 * @param b {date.toLocaleDateString()} - Date of post 2
 */
const sortByDate = (a, b) => {
    if (a.date > b.date) {
        return -1
    } else if (a.date < b.date) {
        return 1
    } else {
        return 0
    }
}
