import { exception } from "console";
import fs from "fs";
import matter from "gray-matter";
import path from "path";
import remark from "remark";
import html from "remark-html";
import remarkPrism from "remark-prism";
import { v4 as uuid } from "uuid";
import { IContentData } from "../pages/blog/[id]";

const projectDirectory = path.join(process.cwd(), "content", "project");
const notesDirectory = path.join(process.cwd(), "content", "notes");
const blogDirectory = path.join(process.cwd(), "content", "blog");

type IContentType = "blog" | "notes" | "project";

/**
 * Get IDs of all markdown post
 * @param {string} contentType Type of content to get ids
 * Called from getStaticPaths of the [id].tsx page
 */
export const getAllContentIds = (contentType: IContentType) => {
  let filenames;
  let baseDir;

  // determine where to look for content types
  switch (contentType) {
    case "blog":
      baseDir = blogDirectory;
      filenames = fs.readdirSync(blogDirectory);
      break;

    case "notes":
      baseDir = notesDirectory;
      filenames = fs.readdirSync(notesDirectory);
      break;

    case "project":
      baseDir = projectDirectory;
      filenames = fs.readdirSync(projectDirectory);
      break;

    default:
      throw new exception("You have to provide a content type");
  }

  // return the slug of all the content IDs
  return filenames.map((filename) => {
    const filePath = path.join(baseDir, filename);
    const fileContent = fs.readFileSync(filePath, "utf-8");

    //convert string at the start of each .md into
    //an object {content: .., data: title:..., slug: ..}
    const matterResult = matter(fileContent);

    return {
      params: {
        // This is where we switch it up to use slug instead of the filename for generating pages
        // id: filename.replace(/\.md$/, ""),
        id: matterResult.data.slug,
      },
    };
  });
};

/**
 * Get data for a given post id
 * @param {string} id ID of the post being passed
 * @param {string} contentType Type of content
 * Called from getStaticProps of the [id].tsx
 */
export const getContentData = async (id: string, contentType: IContentType) => {
  console.log("yea im in here");
  let contentTypeDirectory;
  let filenames;
  switch (contentType) {
    case "blog":
      filenames = fs.readdirSync(blogDirectory);
      contentTypeDirectory = blogDirectory;
      break;

    case "notes":
      filenames = fs.readdirSync(notesDirectory);
      contentTypeDirectory = notesDirectory;
      break;

    case "project":
      filenames = fs.readdirSync(projectDirectory);
      contentTypeDirectory = projectDirectory;
      break;

    default:
      throw new exception("You have to provide a content type");
  }

  // loop through all the content types and compare the slug to get the filename
  const match = filenames.filter((filename) => {
    const filePath = path.join(contentTypeDirectory, filename);

    const fileContent = fs.readFileSync(filePath, "utf-8");
    const matterResult = matter(fileContent);
    const { slug } = matterResult.data;

    return slug === id;
  });

  // use the returned path to get the fullpath and read the file content
  const fullPath = path.join(contentTypeDirectory, match[0]);
  // const fullPath = path.join(contentTypeDirectory, `${id}.md`);
  const fileContents = fs.readFileSync(fullPath, "utf-8");

  const matterResult = matter(fileContents);
  const processedContent = await remark()
    .use(html)
    .use(remarkPrism)
    .process(matterResult.content);

  const contentHtml = processedContent.toString();
  // console.log(matterResult);
  return {
    id,
    contentHtml,
    title: matterResult.data.title,
    date: matterResult.data.date,
    previewImage: matterResult.data.previewImage || "",
    description: matterResult.data.description || "",
    tags: matterResult.data.tags || [],
    category: matterResult.data.category || "",
    liveSite: matterResult.data.liveSite || "",
    sourceCode: matterResult.data.sourceCode || "",
    presentation: matterResult.data.presentation || "",
  };
};

/**
 * Get content list for a particular content type
 * @param {string} contentType Type of content
 * For the landing page of each subpage - called from blog/notes/project.tsx getStaticProps
 */
export const getContentList = (contentType: IContentType) => {
  let contentFiles;
  let contentDir;

  switch (contentType) {
    case "blog":
      contentFiles = fs.readdirSync(blogDirectory);
      contentDir = blogDirectory;

      break;

    case "notes":
      contentFiles = fs.readdirSync(notesDirectory);
      contentDir = notesDirectory;
      break;

    case "project":
      contentFiles = fs.readdirSync(projectDirectory);
      contentDir = projectDirectory;
      break;
  }

  const content = contentFiles
    .filter((content) => content.endsWith(".md"))
    .map((content) => {
      const path = `${contentDir}/${content}`;
      const rawContent = fs.readFileSync(path, {
        encoding: "utf-8",
      });
      const { data } = matter(rawContent);

      return {
        ...data,
        previewImage: data.previewImage || "/images/image-placeholder.png",
        id: uuid(),
      };
    });

  return content.sort(sortByDate);
};

/**
 * Get content type with particular tag
 * @param {string} tag - tag to filter by
 * called from [id].tsx getStaticPaths
 */
export const getContentWithTag = (tag: string, contentType: IContentType) => {
  let contentDir;
  let contentFiles;

  switch (contentType) {
    case "blog":
      contentDir = blogDirectory;
      break;

    case "notes":
      contentDir = notesDirectory;
      break;

    case "project":
      contentDir = projectDirectory;
      break;
  }

  contentFiles = fs.readdirSync(contentDir);

  let contentData = contentFiles
    .filter((content) => content.endsWith(".md"))
    .map((content) => {
      const path = `${contentDir}/${content}`;
      const rawContent = fs.readFileSync(path, {
        encoding: "utf-8",
      });

      const { data } = matter(rawContent);

      return {
        ...data,
        previewImage: data.previewImage || "/images/image-placeholder.png",
        id: uuid(),
      };
    });

  const filteredContent = contentData.filter((content: IContentData) => {
    return content.tags && content.tags.includes(tag);
  });

  return filteredContent.sort(sortByDate);
};

/**
 * Get content type with particular tag
 * @param {string} tag - tag to filter by
 */
export const getContentInCategory = (
  category: string,
  contentType: IContentType
) => {
  let contentDir;
  let contentFiles;

  switch (contentType) {
    case "blog":
      contentDir = blogDirectory;
      break;

    case "notes":
      contentDir = notesDirectory;
      break;

    case "project":
      contentDir = projectDirectory;
      break;
  }

  contentFiles = fs.readdirSync(contentDir);

  let contentData = contentFiles
    .filter((content) => content.endsWith(".md"))
    .map((content) => {
      const path = `${contentDir}/${content}`;
      const rawContent = fs.readFileSync(path, {
        encoding: "utf-8",
      });

      const { data } = matter(rawContent);

      return {
        ...data,
        previewImage: data.previewImage || "/images/image-placeholder.png",
        id: uuid(),
      };
    });

  const filteredContent = contentData.filter((content: IContentData) => {
    return content.category && content.category === category;
  });

  return filteredContent.sort(sortByDate);
};

/**
 * Sorts content by their dates
 * @param a {Date} - Date of post 1
 * @param b {Date} - Date of post 2
 */
const sortByDate = (a, b) => {
  if (a.date > b.date) {
    return -1;
  } else if (a.date < b.date) {
    return 1;
  } else {
    return 0;
  }
};
