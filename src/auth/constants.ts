/** Super-admin emails with full panel access (edit, delete, uploads). */
export const ADMIN_EMAILS = [
  import.meta.env.VITE_ADMIN_EMAIL?.trim() || 'admin@kalarang.com',
  'vineshjm@gmail.com',
];

/** Primary admin email shown on the login form. */
export const ADMIN_EMAIL = ADMIN_EMAILS[0];

export function isAdminEmail(email: string | null | undefined): boolean {
  return Boolean(email && ADMIN_EMAILS.includes(email));
}
