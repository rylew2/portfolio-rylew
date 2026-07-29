import { track } from '@vercel/analytics';

export const CONVERSION_EVENTS = {
  resumeDownload: 'resume_download',
  contactClick: 'contact_click',
  projectVisit: 'project_visit',
  chatOpen: 'chat_open',
  chatSubmitSuccess: 'chat_submit_success',
} as const;

interface ConversionEventProperties {
  resume_download: {
    location: 'navigation' | 'about';
  };
  contact_click: {
    channel: 'email' | 'linkedin';
    location: 'footer';
  };
  project_visit: {
    destination: 'detail' | 'demo' | 'source';
    location: 'card' | 'project_detail';
    project_slug: string;
  };
  chat_open: undefined;
  chat_submit_success: undefined;
}

type ConversionEventName = keyof ConversionEventProperties;
type ConversionEventArguments<EventName extends ConversionEventName> =
  ConversionEventProperties[EventName] extends undefined
    ? []
    : [properties: ConversionEventProperties[EventName]];

/**
 * Sends a deliberately small, typed conversion event catalog to the site's
 * existing Vercel Analytics integration. Analytics must never interrupt the
 * visitor action it observes.
 */
export function trackConversion<EventName extends ConversionEventName>(
  eventName: EventName,
  ...args: ConversionEventArguments<EventName>
): void {
  if (typeof window === 'undefined') return;

  try {
    const properties = args[0] as
      Record<string, string | number | boolean | null> | undefined;
    track(eventName, properties);
  } catch {
    // Tracking is optional and can be unavailable or blocked by the visitor.
  }
}
