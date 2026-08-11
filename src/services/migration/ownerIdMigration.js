import { collection, getDocs, updateDoc, doc, query, where } from 'firebase/firestore';
import { db } from '../../config/firebaseConfig';

const MIGRATION_KEY = 'auth0_migration_done';

/**
 * One-time migration: Firebase stored Google user IDs as plain numbers (e.g. "108123456789").
 * Auth0 stores them as "google-oauth2|108123456789".
 *
 * This function finds all Firestore car documents that still use the old Firebase UID
 * and updates them to the new Auth0 sub format — so existing cars remain editable.
 *
 * It only runs once per browser (guarded by localStorage).
 */
export async function migrateCarOwnership(auth0Sub) {
  // Already migrated in this browser — skip
  if (localStorage.getItem(MIGRATION_KEY) === 'true') return;

  // Only attempt migration for Google-authenticated Auth0 users
  if (!auth0Sub || !auth0Sub.startsWith('google-oauth2|')) {
    localStorage.setItem(MIGRATION_KEY, 'true');
    return;
  }

  // Derive the old Firebase UID from the Auth0 sub
  const oldFirebaseUid = auth0Sub.replace('google-oauth2|', '');

  try {
    const carsRef = collection(db, 'cars');
    const q = query(carsRef, where('ownerId', '==', oldFirebaseUid));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      // No old-format cars found — nothing to migrate
      localStorage.setItem(MIGRATION_KEY, 'true');
      return;
    }

    // Update each car to use the new Auth0 sub as the owner/garage ID
    const updatePromises = snapshot.docs.map((docSnap) =>
      updateDoc(doc(db, 'cars', docSnap.id), {
        ownerId: auth0Sub,
        garageId: auth0Sub,
      })
    );

    await Promise.all(updatePromises);
    console.log(`[Migration] Updated ${snapshot.docs.length} car(s) from Firebase UID → Auth0 sub.`);
  } catch (error) {
    // Non-fatal — log and continue. Migration will retry on next login.
    console.error('[Migration] Failed to migrate car ownership:', error);
    return;
  }

  localStorage.setItem(MIGRATION_KEY, 'true');
}
