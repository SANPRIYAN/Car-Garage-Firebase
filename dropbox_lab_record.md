# 24IT069

## Ex No 4 INTEGRATION OF DROPBOX CLOUD STORAGE
**Date : 15/7/26**

---

### AIM
To design, configure, and integrate Dropbox API (File Storage) and Firebase Services into a web application (Car-Garage) for secure image upload, sharing, and storage management using React.js.

---

### DESCRIPTION 

#### PREREQUISITES
* **Node.js** (v16.x or later) installed on the local system.
* **Code Editor** (e.g., Visual Studio Code).
* **Active Google / Firebase Account.**
* **Active Dropbox Account.**

---

### PROCEDURE & INSTRUCTIONS

#### I: Dropbox API Configuration

**1. Set Up Dropbox Developer App:**
* Navigate to the Dropbox Developer Console (`https://www.dropbox.com/developers/apps`).
* Click **Create app**.
* Select **Scoped access** and choose **App folder** access level.
* Enter `car-garage-storage` as the app name and click **Create app**.
* Navigate to the **Permissions** tab and grant the following access scopes:
  * `files.content.write`
  * `files.content.read`
  * `sharing.write`
* Click **Submit / Save**.
* Navigate to the **Settings** tab, locate **Generated access token**, and click **Generate**. Copy the generated token string.

---

#### II: Environment Setup & Credentials Management

**1. Create Environment Configuration (`.env`):**
* Create a `.env` file in the root directory of your project.
* Populate the environment file with the actual Firebase and Dropbox keys:

```env
VITE_FIREBASE_API_KEY=AIzaSyC-zpYwrhImH8oUum4LWFScrYvskOjDwko
VITE_FIREBASE_AUTH_DOMAIN=car-garage-599e2.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=car-garage-599e2
VITE_FIREBASE_STORAGE_BUCKET=car-garage-599e2.firebasestorage.app
VITE_FIREBASE_APP_ID=1:494541374081:web:0d04a35e85b44704a14380
VITE_DROPBOX_ACCESS_TOKEN=sl.u.AGoOgJnLcge5B4tiw9tkDHG4lsiRpBvnDrqW3TJuNSccW4AfDkbRXr5gqx3-naT2rPBmuaKjHDYo_nvbKVCOwSKPpLa61eYsIWwISvnJ_YRYNcox4yafjXnfAqikV2NxQqtm9ZWyKAO0f0c14T1W96dZnLecU_aA_3X2aCpnBhhr8maVXZzK3S_GWajuj728XZl9e2-HEfvECXr2CN2kuBGK_IK6wcu7ncQhRKtCZnvsIBKxF9UpvorvzAZnRbcvGTUZXiV3XFrK2W_SH6bOydlK7hXwhdbtWAHAEdcW6yjuDyYeqCwFEQy9NP0og9-UfVO212dHSAi-cEHzyUNIhfD-DK-pZdPsZ0KiL0Dy3_RNEkXLL74jVGYXV9TH5VcmrJWaHu7ZN9gBwPoZxGKHmQi8-FwCdWrpux8PPd7UagC7bnhqq5n9ZpNe8YqJ5WJoUuFJ4lh6Y6oD2um6ncYOGGHjuF4ZLkoGjnS8LU9v1GT3jMsC1TbYG0XCEAZE0PW9LpN80AUXB5auEJholJR1fK8v8wHqkmtut2KwNzR8fB9qy0sVcQduXJGa5VWB5XhXzFytiI7jWbw666XXjBnJpYvXQnwnxUQyhRGtiIN2kfgjL3zMG4ZchpChMj07ZH_glgRV0ONV4kEMhKeBBdj2gEhXOMFvcZ3nEb6nkpFrlYSsNWEcqA_h5jQSJm4ZtuiI2EL2z_S6c_ZimRNASaTeho8vcpsMwqKeW6qEJw9ts6TFZaRJXgAXAy1OCL3sFFdf4k_BB9Zhe1Qhg86jEfothyaYdcTjsusT8g9GRz0MS9V31FMwVLs0b1WgzFbT9ts9ELdhbSGC4sZOfG5us9i1ZV7MxGXWDJb9sdXwFfcQOnjIWjjk2jeCo37LdfYF6y46iMXBr7mjqX3U78JMMZGR6-mgh6UawnQHID1NiroRALtQW_EvSGlOUhDAdtlK485TQUVqlvmqglzP2EpacyDtSzJpJNUQep3W5IY4po5OV7ErmoolSj8ufxLNxf2O7544m_n0w5jdQCNxn7gZ2Sf7WR2GBJ_sBxzLdlMjPu8l5TE5GKkhWEtS7mKXJg1jyo2T6PLVoiAJTtMToHMF27WWxQDE4kv3F5lgkqOc4VzG0qFHOwdsSzlRiauOCE9VzH7zkq2moWhN5OjPdAP6R6zQ7qyWC_TLymgsU4MIDUXWNw_EjWLYKAO_RqHcF_q6knCxNjFy1PJt0iYwHflvjPTVm6hmKdRem7FjKaPPKLZCiixJ2M6G1lPu4kBJ6t2Y5AIvOjukhyNDB0QB1RQgT0eTiIuKPb5PtqLj9Uex1qcPQZBpupfE2PeL_-c_MW93fMLMLnq7x6kvf1nrFIBKV4pj9A6wBuZ_WSiopESVI_g0U3UPBNMczBbWSNbshkFyHp91vpfgD7mTNitHbMpp1UzJFHe6Y1Owd0aPrUCN7Um7wWRzDbe5kAwVdTZfxHwyKVsTursS2ObBoIDsBxA_KfGCVsT0
```

---

#### III: Important Backend & Service Logic Code

**1. Dropbox Authentication Logic (`src/services/dropbox/dropboxAuth.js`)**
```javascript
export async function getShortLivedDropboxToken() {
  const token = import.meta.env.VITE_DROPBOX_ACCESS_TOKEN;
  if (!token) {
    throw new Error("Dropbox token is missing in .env!");
  }
  return token;
}
```

**2. Dropbox REST API Handler (`src/services/dropbox/dropboxUpload.js`)**
```javascript
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
  // Swap domain to dl.dropboxusercontent.com for direct raw embedding
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
```

**3. Multi-Service Orchestrator (`src/services/orchestration/carImageOrchestrator.js`)**
```javascript
import { getShortLivedDropboxToken } from '../dropbox/dropboxAuth';
import { uploadFileToDropbox, getSharedLink, deleteFileFromDropbox } from '../dropbox/dropboxUpload';
import { carService } from '../firestore/carService';

// Coordinates Dropbox file operations with Firestore document updates
export async function uploadCarImage({ carId, garageId, file }) {
  try {
    const accessToken = await getShortLivedDropboxToken();

    const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const uniqueName = `${Date.now()}-${safeName}`;
    const path = `/garages/${garageId}/cars/${carId}/${uniqueName}`;
    
    await uploadFileToDropbox(accessToken, path, file);
    const sharedUrl = await getSharedLink(accessToken, path);

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
    const deleteResult = await carService.remove(car.id);
    if (!deleteResult.success) {
      return { success: false, error: deleteResult.error };
    }

    if (car.imagePath) {
      try {
        const accessToken = await getShortLivedDropboxToken();
        await deleteFileFromDropbox(accessToken, car.imagePath);
      } catch (dropboxError) {
        console.warn('Failed to clean up Dropbox image:', dropboxError);
      }
    }

    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
```

**4. Firestore Database CRUD Operations (`src/services/firestore/carService.js`)**
```javascript
import {
  collection, doc, getDoc, getDocs, addDoc, updateDoc, deleteDoc,
  query, where,
} from 'firebase/firestore';
import { db } from '../../config/firebaseConfig';

const carsCollection = collection(db, 'cars');

export const carService = {
  async getAll() {
    try {
      const snapshot = await getDocs(carsCollection);
      const cars = snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() }));
      return { success: true, data: cars };
    } catch (error) {
      return { success: false, error: `Failed to fetch all cars: ${error.message}` };
    }
  },

  async create(carData) {
    try {
      const docRef = await addDoc(carsCollection, carData);
      return { success: true, data: docRef.id };
    } catch (error) {
      return { success: false, error: `Failed to create car: ${error.message}` };
    }
  },

  async update(carId, updates) {
    try {
      await updateDoc(doc(db, 'cars', carId), updates);
      return { success: true };
    } catch (error) {
      return { success: false, error: `Failed to update car: ${error.message}` };
    }
  },

  async remove(carId) {
    try {
      await deleteDoc(doc(db, 'cars', carId));
      return { success: true };
    } catch (error) {
      return { success: false, error: `Failed to delete car: ${error.message}` };
    }
  },
};
```

---

#### IV: Deployment & Verification

**1. Build and Deploy via Firebase CLI:**
* Compile the application for production: `npm run build`
* Deploy to Firebase Hosting: `firebase deploy --only hosting`

**2. Verify Application Functionality:**
* Start the local server for verification: `npm run dev`
* Open `http://localhost:5173` (or live hosting URL `https://car-garage-599e2.web.app`).
* Add a vehicle record with an image file attached.
* Verify image upload to Dropbox Cloud Storage and Firestore document synchronization.

---

### RESULT
The CAR-GARAGE application was successfully built, configured, and deployed. Dynamic car data was stored in Cloud Firestore, vehicle images were uploaded through the Dropbox API, and the web application was hosted live on Firebase Hosting.
