import { getShortLivedDropboxToken } from '../dropbox/dropboxAuth';
import { uploadFileToDropbox, getSharedLink, deleteFileFromDropbox } from '../dropbox/dropboxUpload';
import { carService } from '../firestore/carService';

// This is the one function that knows about BOTH Dropbox and Firestore.
// Everything else in the app only ever talks to one or the other.
export async function uploadCarImage({ carId, garageId, file }) {
  try {
    // Step 1: get a fresh, short-lived Dropbox token
    const accessToken = await getShortLivedDropboxToken();

    // Step 2: upload the actual image file to Dropbox
    // We sanitize the filename to avoid non-ASCII characters which break HTTP headers (Status 400)
    const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const uniqueName = `${Date.now()}-${safeName}`;
    const path = `/garages/${garageId}/cars/${carId}/${uniqueName}`;
    await uploadFileToDropbox(accessToken, path, file);

    // Step 3: get a link we can actually show in the browser
    const sharedUrl = await getSharedLink(accessToken, path);

    // Step 4: save that link on the car's Firestore document
    const updateResult = await carService.update(carId, {
      imagePath: path,
      imageUrl: sharedUrl,
      updatedAt: new Date().toISOString(),
    });

    if (!updateResult.success) {
      return { success: false, error: updateResult.error };
    }

    return { success: true, data: { path, sharedUrl } };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function deleteCarAndImage(car) {
  try {
    // Step 1: Delete from Firestore first
    const deleteResult = await carService.remove(car.id);
    if (!deleteResult.success) {
      return { success: false, error: deleteResult.error };
    }

    // Step 2: Delete from Dropbox if there's an image
    if (car.imagePath) {
      try {
        const accessToken = await getShortLivedDropboxToken();
        await deleteFileFromDropbox(accessToken, car.imagePath);
      } catch (dropboxError) {
        // We still consider the car successfully deleted from our DB, 
        // even if Dropbox cleanup fails (e.g. file already missing).
        console.warn('Failed to clean up Dropbox image:', dropboxError);
      }
    }

    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
