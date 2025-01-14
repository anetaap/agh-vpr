import {useToast} from '@chakra-ui/react';
import {Place} from '../utils/stores';
import {useAxios, useAxiosSWR, useMutate} from '../utils/useAxios';
import {SmallPlaceBox} from './PlaceBox';

export default function RecentPlacesList() {
  const {data: places, error, isLoading} = useAxiosSWR<Place[]>('/history/');
  const axios = useAxios();
  const mutate = useMutate();
  const toast = useToast();

  const clearHistory = async () => {
    await axios.delete('/history/');
    await mutate('/history/');
    toast({
      title: 'Historia wyczyszczona',
      description: 'Pomyślnie wyczyszczono historię',
      status: 'success',
      duration: 5000,
      isClosable: true,
    });
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        {
            (places && places?.length === 0) && (
              <p className="text-sm text-slate-500">Nie odwiedziłeś jeszcze żadnych miejsc.</p>
            )
          }
        {
            isLoading && (
              <div className="animate-pulse flex flex-row gap-2">
                <div className="h-4 w-4 bg-slate-500 rounded-full" />
                <div className="h-4 w-20 bg-slate-500 rounded-full" />
              </div>
            )
          }
        {
            places && places?.length > 0 && (
              <div className="flex flex-col gap-2">
                {
                  places.map((place) => (
                    <SmallPlaceBox key={place.id} result={place} />
                  ))
                }
                {
                  places.length > 0 && (
                    <button
                      className="rounded mt-2 text-sm font-bold text-red-500 hover:text-red-600 self-end hover:underline"
                      onClick={clearHistory}
                      type="button"
                    >
                      Wyczyść historię
                    </button>
                  )
                }
              </div>
            )
          }
      </div>
    </div>

  );
}
