const { onCall } = require("firebase-functions/v2/https");

// This function is called securely by your React app.
// It reads the Dropbox API Key (or Access Token) from the secure .env file
// and passes it down to the frontend.
exports.getDropboxAccessToken = onCall((request) => {
  // Ensure the user is authenticated (Optional but recommended for security)
  if (!request.auth) {
    throw new Error("Must be logged in to upload images!");
  }

  // Get the Dropbox Access Token from the backend environment
  const token = process.env.DROPBOX_ACCESS_TOKEN;

  if (!token) {
    throw new Error("Dropbox API Key is missing on the server!");
  }

  // Return it to the frontend
  return { accessToken: token };
});
