import assert from 'node:assert/strict';
import test from 'node:test';

import {
  getContentData,
  getContentInCategory,
  getContentList,
  getContentWithTag,
} from '../lib/content';

test('content list items have stable slug-based identities', () => {
  const firstRead = getContentList('project');
  const secondRead = getContentList('project');

  assert.ok(firstRead.length > 0);
  assert.deepEqual(
    firstRead.map(({ id }) => id),
    secondRead.map(({ id }) => id)
  );
  assert.deepEqual(
    firstRead.map(({ id }) => id),
    firstRead.map(({ slug }) => slug)
  );
});

test('taxonomy queries are filtered projections of the content list', () => {
  const projects = getContentList('project');
  const expectedReactProjects = projects.filter((project) =>
    project.tags.includes('react')
  );

  assert.deepEqual(
    getContentWithTag('react', 'project'),
    expectedReactProjects
  );

  const books = getContentList('book');
  const category = books.find((book) => book.category)?.category;
  if (category) {
    assert.deepEqual(
      getContentInCategory(category, 'book'),
      books.filter((book) => book.category === category)
    );
  }
});

test('content list items omit undefined values for Next.js serialization', () => {
  for (const item of [
    ...getContentList('book'),
    ...getContentList('project'),
  ]) {
    assert.equal(
      Object.values(item).includes(undefined),
      false,
      `${item.path}/${item.slug} includes an undefined property`
    );
  }
});

test('missing content reports its type and slug', async () => {
  await assert.rejects(
    () => getContentData('does-not-exist', 'project'),
    /Unknown project content slug: does-not-exist/
  );
});
