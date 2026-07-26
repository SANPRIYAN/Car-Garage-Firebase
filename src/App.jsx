import { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './config/firebaseConfig';
import { signOutUser } from './services/auth';

import { Login } from './components/Login';
import { AddCarForm } from './features/cars/AddCarForm';
import { CarList } from './features/cars/CarList';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 selection:bg-purple-500/30">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <header className="mb-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
              Car Garage
            </h1>
            <p className="text-slate-400 mt-1 font-medium">Manage your collection, {user.displayName || 'Driver'}.</p>
          </div>
          
          <button 
            onClick={signOutUser}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-sm font-medium transition-all text-slate-300 hover:text-white"
          >
            Sign Out
          </button>
        </header>

        <main className="flex flex-col lg:flex-row gap-8 items-start">
          <aside className="w-full lg:w-1/3 xl:w-1/4 sticky top-8">
            <AddCarForm user={user} />
          </aside>
          <section className="w-full lg:w-2/3 xl:w-3/4">
            <CarList user={user} />
          </section>
        </main>
      </div>
    </div>
  );
}

export default App;
