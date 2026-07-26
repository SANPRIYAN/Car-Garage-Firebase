import { useAllCars } from '../../hooks/useCars';
import { CarCard } from './CarCard';

export function CarList({ user }) {
  const { data: result, isLoading } = useAllCars();

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-purple-500 mb-4"></div>
        <p className="text-slate-400 font-medium">Loading community garage...</p>
      </div>
    );
  }

  if (!result?.success) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="text-red-400 mb-2">
          <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <p className="text-slate-300 font-medium text-lg">Failed to load cars</p>
        <p className="text-slate-500 text-sm mt-1">{result?.error}</p>
      </div>
    );
  }

  const cars = result.data;

  if (cars.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center border-2 border-dashed border-slate-700/50 rounded-3xl bg-white/5">
        <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mb-4">
          <svg className="w-10 h-10 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-white mb-2">The garage is empty</h3>
        <p className="text-slate-400 max-w-sm">
          Be the first to add a car to the community collection!
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
      {cars.map((car) => (
        <CarCard key={car.id} car={car} currentUser={user} />
      ))}
    </div>
  );
}
