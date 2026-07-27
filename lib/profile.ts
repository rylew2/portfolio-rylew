import profileJson from '../me/profile.json';

export interface Experience {
  company: string;
  title: string;
  start: string;
  end: string;
  highlights?: string[];
}

export interface Education {
  school: string;
  credential: string;
  years?: string;
  detail?: string;
  coursework?: string[];
}

export interface Certification {
  name: string;
  /** Optional: not every certification is worth dating on the page. */
  issued?: string;
}

export interface SkillGroup {
  group: string;
  items: string[];
}

export interface Volunteering {
  organization: string;
  dates: string;
  description: string;
}

export interface Profile {
  name: string;
  role: string;
  location: string;
  bio: string[];
  experience: Experience[];
  education: Education[];
  certifications: Certification[];
  skills: SkillGroup[];
  volunteering: Volunteering[];
  interests: string[];
  links: {
    linkedin: string;
    github: string;
    email: string;
    /** Null until a résumé PDF is added to public/. Nullable so the About page
     *  and the nav link stay hidden rather than pointing at a 404. */
    resume: string | null;
  };
}

/**
 * me/profile.json is the single source of truth for biographical facts. It also
 * generates me/summary.txt, which is what the chat API feeds the model — see
 * scripts/generate-summary.ts.
 */
export const profile = profileJson as Profile;
