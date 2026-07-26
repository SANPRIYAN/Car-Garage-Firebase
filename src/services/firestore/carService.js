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

  async getAllForGarage(garageId) {
    try {
      const q = query(carsCollection, where('garageId', '==', garageId));
      const snapshot = await getDocs(q);
      const cars = snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() }));
      return { success: true, data: cars };
    } catch (error) {
      return { success: false, error: `Failed to fetch cars: ${error.message}` };
    }
  },

  async getById(carId) {
    try {
      const docSnap = await getDoc(doc(db, 'cars', carId));
      if (!docSnap.exists()) {
        return { success: true, data: null };
      }
      return { success: true, data: { id: docSnap.id, ...docSnap.data() } };
    } catch (error) {
      return { success: false, error: `Failed to fetch car: ${error.message}` };
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
