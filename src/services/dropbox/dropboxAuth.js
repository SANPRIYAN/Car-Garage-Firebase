// Because Firebase Cloud Functions require a paid "Blaze" plan to deploy,
// we are falling back to the "Option B" approach for this lab project.
// We read the token directly from the frontend .env file instead of a Cloud Function.

export async function getShortLivedDropboxToken() {
  const token = import.meta.env.VITE_DROPBOX_ACCESS_TOKEN;
  if (!token) {
    throw new Error("Dropbox token is missing in .env!");
  }
  return token;
}
