import { test, expect } from "@playwright/test";
import { profile } from "../lib/profile";

test.beforeEach(async ({ page }) => {
  await page.goto("/about");
});

test("about page states role and location", async ({ page }) => {
  await expect(
    page.getByRole("heading", { name: `About ${profile.name}`, level: 1 })
  ).toBeVisible();
  await expect(
    page.getByText(`${profile.role} · ${profile.location}`)
  ).toBeVisible();
});

test("about page lists every role in the profile", async ({ page }) => {
  const entries = page.locator("main .timeline li");
  await expect(entries).toHaveCount(profile.experience.length);

  for (const job of profile.experience) {
    const entry = entries.filter({ hasText: job.company });
    await expect(entry).toContainText(job.title);
    await expect(entry).toContainText(job.start);
    await expect(entry).toContainText(job.end);
  }
});

test("about page lists education and certifications", async ({ page }) => {
  const entries = page.locator("main .credentials li");
  await expect(entries).toHaveCount(
    profile.education.length + profile.certifications.length
  );

  for (const school of profile.education) {
    await expect(entries.filter({ hasText: school.school })).toContainText(
      school.credential
    );
  }
  for (const certification of profile.certifications) {
    await expect(entries.filter({ hasText: certification.name })).toContainText(
      certification.issued
    );
  }
});

test("about page lists every skill in the profile", async ({ page }) => {
  const skills = page.locator("main .skillGroups");
  await expect(page.locator("main .skillGroup")).toHaveCount(
    profile.skills.length
  );

  for (const group of profile.skills) {
    await expect(skills.locator("dt", { hasText: group.group })).toBeVisible();
    for (const item of group.items) {
      // Exact matching: "GraphQL" would otherwise also match the
      // "GraphQL (Apollo Client)" pill and trip strict mode.
      await expect(skills.getByText(item, { exact: true })).toBeVisible();
    }
  }
});

test("about page links to contact channels", async ({ page }) => {
  const contact = page.locator("main .contactList");

  await expect(contact.getByRole("link", { name: "LinkedIn" })).toHaveAttribute(
    "href",
    profile.links.linkedin
  );
  await expect(contact.getByRole("link", { name: "GitHub" })).toHaveAttribute(
    "href",
    profile.links.github
  );
  await expect(
    contact.getByRole("link", { name: profile.links.email })
  ).toHaveAttribute("href", `mailto:${profile.links.email}`);
});

// Passes in both states: it asserts the résumé is absent while
// links.resume is null, and asserts it actually serves a PDF once set.
test("resume link matches the profile configuration", async ({
  page,
  request,
}) => {
  const navResume = page.locator("nav").getByRole("link", { name: "Resume" });
  const aboutResume = page
    .locator("main")
    .getByRole("link", { name: "Résumé (PDF)" });

  if (!profile.links.resume) {
    await expect(navResume).toHaveCount(0);
    await expect(aboutResume).toHaveCount(0);
    return;
  }

  await expect(navResume).toHaveAttribute("href", profile.links.resume);
  await expect(aboutResume).toHaveAttribute("href", profile.links.resume);

  const response = await request.get(profile.links.resume);
  expect(response.status()).toBe(200);
  expect(response.headers()["content-type"]).toContain("pdf");
});
