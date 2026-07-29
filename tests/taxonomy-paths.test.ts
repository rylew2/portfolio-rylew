import assert from 'node:assert/strict';
import { describe, test } from 'node:test';

import { getStaticPaths as getBookCategoryPaths } from '../pages/books/categories/[category]';
import {
  getStaticPaths as getBookTagPaths,
  getStaticProps as getBookTagProps,
} from '../pages/books/tags/[tag]';
import {
  getStaticPaths as getProjectTagPaths,
  getStaticProps as getProjectTagProps,
} from '../pages/projects/tags/[tag]';

const getParameterValues = (
  paths: Array<{ params: Record<string, string> }>,
  parameter: string
) => paths.map(({ params }) => params[parameter]).sort();

describe('taxonomy static paths', () => {
  test('book tag paths include only tags used by books', async () => {
    const result = await getBookTagPaths();

    assert.equal(result.fallback, false);
    assert.deepEqual(getParameterValues(result.paths, 'tag'), [
      'devops',
      'engineering',
      'management',
    ]);
  });

  test('project tag paths include only tags used by projects', async () => {
    const result = await getProjectTagPaths();

    assert.equal(result.fallback, false);
    assert.deepEqual(getParameterValues(result.paths, 'tag'), [
      'angular',
      'clustering',
      'd3',
      'dimensionality reduction',
      'django',
      'edtech',
      'flask',
      'fullstack',
      'graphql',
      'javascript',
      'machine learning',
      'mdp',
      'omscs',
      'optimization',
      'policy iteration',
      'postgres',
      'python',
      'q-learning',
      'randomized algorithms',
      'react',
      'reinforcement learning',
      'sklearn',
      'value iteration',
      'vue',
    ]);
  });

  test('book category paths exclude categories unused by books', async () => {
    const result = await getBookCategoryPaths();

    assert.equal(result.fallback, false);
    assert.deepEqual(getParameterValues(result.paths, 'category'), []);
  });

  test('retained book tag paths keep configured metadata and content', async () => {
    const result = await getBookTagProps({ params: { tag: 'devops' } });

    assert.equal(result.props.title, 'DevOps');
    assert.equal(result.props.description, 'DevOps practices and tooling');
    assert.ok(result.props.content.length > 0);
  });

  test('retained project tag paths keep configured metadata and content', async () => {
    const result = await getProjectTagProps({
      params: { tag: 'javascript' },
    });

    assert.equal(result.props.title, 'JavaScript');
    assert.equal(result.props.description, 'All things javascript');
    assert.ok(result.props.content.length > 0);
  });
});
