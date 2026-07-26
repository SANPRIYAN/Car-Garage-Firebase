import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { carService } from '../services/firestore/carService';
import { uploadCarImage, deleteCarAndImage } from '../services/orchestration/carImageOrchestrator';

export function useAllCars() {
  return useQuery({
    queryKey: ['cars', 'all'],
    queryFn: () => carService.getAll(),
  });
}

export function useCars(garageId) {
  return useQuery({
    queryKey: ['cars', garageId],
    queryFn: () => carService.getAllForGarage(garageId),
    enabled: !!garageId,
  });
}

export function useCreateCar() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (carData) => carService.create(carData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cars', 'all'] });
    },
  });
}

export function useUpdateCar() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ carId, updates }) => carService.update(carId, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cars', 'all'] });
    },
  });
}

export function useDeleteCar() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (car) => deleteCarAndImage(car),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cars', 'all'] });
    },
  });
}

export function useCarImageUpload() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (params) => uploadCarImage(params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cars', 'all'] });
    },
  });
}
