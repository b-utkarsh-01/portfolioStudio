import { sanitizeText, ensurePhoneHref, ensureEmailHref, ensureGithubHref, splitCsv } from "../formDataHelpers";

export const getFirstName = (name) => `${name || ""}`.trim().split(/\s+/).filter(Boolean)[0] || "";

export const getInitials2 = (name) =>
  `${name || ""}`
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() || "")
    .join("");

export const mapProfile = (form, contactsFromItems) => {
  const phoneText = sanitizeText(form.phone);
  const phoneHref = ensurePhoneHref(form.phone, form.phoneHref);
  const emailText = sanitizeText(form.email);
  const emailHref = ensureEmailHref(form.email, form.emailHref);
  const githubText = sanitizeText(form.github);
  const githubHref = ensureGithubHref(form.github, form.githubHref);
  const titleList = `${form.titles || ""}`
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
  const resolvedName = form.name.trim();

  return {
    profile: {
      name: resolvedName,
      title: titleList,
      summary: form.summary.trim(),
      avatar: form.avatar.trim(),
      highlights: splitCsv(form.highlights),
      contacts:
        contactsFromItems.length > 0
          ? contactsFromItems
          : [
              phoneText && phoneHref ? { type: "phone", text: phoneText, href: phoneHref } : null,
              emailText && emailHref ? { type: "email", text: emailText, href: emailHref } : null,
              githubText && githubHref ? { type: "github", text: githubText, href: githubHref, external: true } : null,
            ].filter(Boolean),
    },
    badgeName: {
      name: getFirstName(resolvedName),
      logo: getInitials2(resolvedName),
      badgeTitle: titleList[0] || "",
    },
  };
};
