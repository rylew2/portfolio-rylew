/**
 * Generates me/summary.txt from me/profile.json.
 *
 * me/profile.json is the single source of truth for biographical facts. The
 * About page imports it directly; the chat API reads the summary.txt emitted
 * here (pages/api/chat.ts -> loadSummary) so the assistant can never contradict
 * what the page shows.
 *
 * Deliberately no "generated file, do not edit" banner in the output: chat.ts
 * interpolates summary.txt verbatim into the LLM system prompt, so any banner
 * would become part of the prompt. Edit profile.json instead.
 *
 * Project descriptions are intentionally absent. The prompt already receives
 * every project from me/chat-context.json in far more detail, generated from
 * content/project/*.md.
 */
import fs from 'fs';
import path from 'path';
import type { Education, Profile } from '../lib/profile';

const profilePath = path.join(process.cwd(), 'me', 'profile.json');
const outputPath = path.join(process.cwd(), 'me', 'summary.txt');

function formatEducation(entry: Education): string {
  // School first, matching the company-first shape of the work experience
  // lines. Credential is free text because not every entry is a named degree.
  const headline = [
    `- ${entry.school} — ${entry.credential}`,
    entry.years,
    entry.detail,
  ]
    .filter(Boolean)
    .join(', ');

  if (!entry.coursework?.length) {
    return headline;
  }

  return `${headline}\n  Coursework: ${entry.coursework.join(', ')}`;
}

function buildSummary(profile: Profile): string {
  const sections: string[] = [];

  sections.push(
    `${profile.name} is a ${profile.role} based in ${profile.location}.`
  );
  sections.push(profile.bio.join('\n\n'));

  sections.push(
    [
      'WORK EXPERIENCE:',
      ...profile.experience.flatMap((job) => [
        `- ${job.company} - ${job.title} (${job.start} - ${job.end})`,
        ...(job.highlights ?? []).map((highlight) => `  - ${highlight}`),
      ]),
    ].join('\n')
  );

  sections.push(
    ['EDUCATION:', ...profile.education.map(formatEducation)].join('\n')
  );

  if (profile.certifications.length) {
    sections.push(
      [
        'CERTIFICATIONS:',
        ...profile.certifications.map((cert) =>
          cert.issued
            ? `- ${cert.name} (issued ${cert.issued})`
            : `- ${cert.name}`
        ),
      ].join('\n')
    );
  }

  sections.push(
    [
      'TECHNICAL SKILLS:',
      ...profile.skills.map(
        (group) => `- ${group.group}: ${group.items.join(', ')}`
      ),
    ].join('\n')
  );

  if (profile.volunteering.length) {
    sections.push(
      [
        'VOLUNTEERING:',
        ...profile.volunteering.map(
          (entry) =>
            `- ${entry.organization} (${entry.dates}) - ${entry.description}`
        ),
      ].join('\n')
    );
  }

  sections.push(
    [
      'INTERESTS OUTSIDE WORK:',
      ...profile.interests.map((interest) => `- ${interest}`),
    ].join('\n')
  );

  const contact = [
    'CONTACT:',
    `- LinkedIn: ${profile.links.linkedin}`,
    `- GitHub: ${profile.links.github}`,
    `- Email: ${profile.links.email}`,
  ];
  if (profile.links.resume) {
    contact.push(`- Resume: ${profile.links.resume}`);
  }
  sections.push(contact.join('\n'));

  return `${sections.join('\n\n')}\n`;
}

function main() {
  console.log('Generating profile summary...');

  const profile = JSON.parse(fs.readFileSync(profilePath, 'utf-8')) as Profile;
  const summary = buildSummary(profile);

  fs.writeFileSync(outputPath, summary);

  console.log(`Generated profile summary:`);
  console.log(`  - ${profile.experience.length} roles`);
  console.log(`  - ${profile.education.length} schools`);
  console.log(
    `  - ${profile.skills.reduce((total, group) => total + group.items.length, 0)} skills`
  );
  console.log(`  - Total size: ${(summary.length / 1024).toFixed(2)} KB`);
  console.log(`Output: ${outputPath}`);
}

main();
