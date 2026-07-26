// Uploads a file to Dropbox using a valid access token.
export async function uploadFileToDropbox(accessToken, path, file) {
  const response = await fetch('https://content.dropboxapi.com/2/files/upload', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/octet-stream',
      'Dropbox-API-Arg': JSON.stringify({
        path,
        mode: 'add',
        autorename: true,
      }),
    },
    body: file,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Dropbox upload failed with status ${response.status}: ${errorText}`);
  }

  return response.json();
}

// Creates (or fetches an existing) shareable link for a file already in Dropbox.
export async function getSharedLink(accessToken, path) {
  const response = await fetch('https://api.dropboxapi.com/2/sharing/create_shared_link_with_settings', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ path }),
  });

  if (!response.ok) {
    throw new Error(`Failed to get shared link, status ${response.status}`);
  }

  const data = await response.json();
  // Dropbox share links use www.dropbox.com which can block <img> tag embedding.
  // We must swap the domain to dl.dropboxusercontent.com for direct raw access.
  return data.url.replace('www.dropbox.com', 'dl.dropboxusercontent.com').replace('?dl=0', '');
}

// Deletes a file from Dropbox.
export async function deleteFileFromDropbox(accessToken, path) {
  const response = await fetch('https://api.dropboxapi.com/2/files/delete_v2', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ path }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to delete from Dropbox, status ${response.status}: ${errorText}`);
  }

  return response.json();
}
