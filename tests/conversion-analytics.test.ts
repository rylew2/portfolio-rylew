import assert from 'node:assert/strict';
import test from 'node:test';
import {
  CONVERSION_EVENTS,
  trackConversion,
} from '../lib/conversion-analytics';

const originalWindowDescriptor = Object.getOwnPropertyDescriptor(
  globalThis,
  'window'
);

test.afterEach(() => {
  if (originalWindowDescriptor) {
    Object.defineProperty(globalThis, 'window', originalWindowDescriptor);
  } else {
    Reflect.deleteProperty(globalThis, 'window');
  }
});

test('sends stable conversion names and low-cardinality metadata to Vercel Analytics', () => {
  const calls: unknown[][] = [];
  Object.defineProperty(globalThis, 'window', {
    configurable: true,
    value: {
      va: (...args: unknown[]) => calls.push(args),
    },
  });

  trackConversion(CONVERSION_EVENTS.resumeDownload, {
    location: 'navigation',
  });
  trackConversion(CONVERSION_EVENTS.contactClick, {
    channel: 'linkedin',
    location: 'footer',
  });
  trackConversion(CONVERSION_EVENTS.projectVisit, {
    destination: 'source',
    location: 'project_detail',
    project_slug: 'cardgame',
  });
  trackConversion(CONVERSION_EVENTS.chatOpen);
  trackConversion(CONVERSION_EVENTS.chatSubmitSuccess);

  assert.deepEqual(calls, [
    [
      'event',
      {
        name: 'resume_download',
        data: { location: 'navigation' },
        options: undefined,
      },
    ],
    [
      'event',
      {
        name: 'contact_click',
        data: { channel: 'linkedin', location: 'footer' },
        options: undefined,
      },
    ],
    [
      'event',
      {
        name: 'project_visit',
        data: {
          destination: 'source',
          location: 'project_detail',
          project_slug: 'cardgame',
        },
        options: undefined,
      },
    ],
    ['event', { name: 'chat_open', options: undefined }],
    ['event', { name: 'chat_submit_success', options: undefined }],
  ]);
});

test('does not throw when analytics is unavailable', () => {
  assert.doesNotThrow(() =>
    trackConversion(CONVERSION_EVENTS.chatSubmitSuccess)
  );

  Object.defineProperty(globalThis, 'window', {
    configurable: true,
    value: {},
  });

  assert.doesNotThrow(() => trackConversion(CONVERSION_EVENTS.chatOpen));
});

test('does not disrupt visitor actions when the analytics transport fails', () => {
  Object.defineProperty(globalThis, 'window', {
    configurable: true,
    value: {
      va: () => {
        throw new Error('analytics blocked');
      },
    },
  });

  assert.doesNotThrow(() =>
    trackConversion(CONVERSION_EVENTS.resumeDownload, {
      location: 'about',
    })
  );
});
