/* eslint-disable max-len */
/* eslint-disable jsx-a11y/label-has-associated-control */
import {useToast} from '@chakra-ui/react';
import {ArrowLeftIcon, CameraIcon, PlusCircleIcon} from '@heroicons/react/24/outline';
import {ChangeEvent, useState} from 'react';
import {useForm} from 'react-hook-form';
import {Link, useNavigate} from 'react-router-dom';
import GlowButton from '../components/GlowButton';
import TextInput from '../components/TextInput';
import {useUserStore} from '../utils/stores';
import {useAxios} from '../utils/useAxios';

type FormData = {
  name: string;
  code: string;
  address: string;
  description?: string;
  image: File;
};

export default function AddPlaceView() {
  const {
    register, reset, formState: {errors}, watch, handleSubmit, setValue,
  } = useForm<FormData>();
  const user = useUserStore((state) => state.user);
  const navigate = useNavigate();
  const axios = useAxios();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const postToast = useToast();

  const onSubmit = async (data: FormData) => {
    const formData = new FormData();
    formData.append('file', data.image);
    formData.append('name', data.name);
    formData.append('code', data.code);
    formData.append('address', data.address);
    formData.append('description', data.description ?? '');
    setIsSubmitting(true);

    try {
      await axios.post('/place/create', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      postToast({
        title: 'Dodano!',
        description: 'Pomyślnie dodano miejsce',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      navigate('/');
    } catch (err) {
      console.error(err);
      postToast({
        title: 'Błąd',
        description: 'Nie udało się dodać miejsca',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto pt-6 md:pt-10 px-4 mb-10">
      <div className="flex flex-row items-cente mb-5 md:mb-10">
        <Link to="/">
          <div className="flex flex-row items-center gap-2">
            <ArrowLeftIcon className="h-6 w-6 text-indigo-200" />
            <p className="underline">
              <span className="text-indigo-200 text-lg">Wróć do wyszukiwania</span>
            </p>
          </div>
        </Link>
      </div>
      <div className="flex flex-col items-center mb-3 w-full">
        <div className="w-full p-6 md:p-8 rounded border border-indigo-600 backdrop-brightness-125">
          <h1 className="text-3xl font-bold font-secondary">Dodaj miejsce</h1>
          <p className="text-lg font-secondary">Wypełnij poniższy formularz, aby dodać nowe miejsce</p>
          <form
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="flex flex-col w-full items-center gap-4">
              <div className="flex w-full flex-1 flex-col items-center sm:items-start">
                <div
                  className="flex flex-col gap-4 w-full mt-4"
                >
                  <TextInput
                    label="Nazwa budynku"
                    error={errors.name?.message}
                    placeholder="Katedra Informatyki Stosowanej AGH"
                    register={register('name', {
                      required: {
                        value: true,
                        message: 'Nazwa jest wymagana',
                      },
                    })}
                  />
                  <TextInput
                    label="Kod budynku"
                    error={errors.code?.message}
                    placeholder="C-2"
                    register={register('code', {
                      required: {
                        value: true,
                        message: 'Kod jest wymagany',
                      },
                    })}
                  />
                  <TextInput
                    label="Adres budynku"
                    error={errors.address?.message}
                    placeholder="ul. Mickiewicza 30, 30-059 Kraków"
                    register={register('address', {
                      required: {
                        value: true,
                        message: 'Adres jest wymagany',
                      },
                    })}
                  />
                  <div className="flex flex-col gap-2">
                    <label htmlFor="description" className="text-md">Opis budynku</label>
                    <textarea
                      className="p-2 rounded-md bg-slate-800 border border-indigo-800 focus:outline-none focus:border-indigo-500"
                      placeholder="Opis"
                      {...register('description')}
                    />
                  </div>
                </div>
              </div>
              <div className="flex-1 h-full w-full flex">
                <label
                  htmlFor="dropzone-file"
                  // eslint-disable-next-line max-len
                  className="flex-1 flex-col py-2 px-5 transition-all hover:shadow-xl shadow-lg duration-300 select-none backdrop-blur-sm border-2 border-indigo-600 cursor-pointer hover:border-indigo-400 backdrop-brightness-125 hover:backdrop-brightness-150 items-start justify-center rounded-lg"
                >
                  <div className="flex flex-row items-center gap-3">
                    <CameraIcon className="w-8 h-8 text-indigo-200" />
                    <p className="text-sm text-indigo-200 font-semibold">
                      {
                        watch('image')
                          ? watch('image')?.name
                          : 'Dodaj zdjęcie'
                      }
                    </p>
                  </div>
                  <input
                    id="dropzone-file"
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files) {
                        setValue('image', e.target.files[0]);
                      }
                    }}
                    required
                  />
                </label>
                {
                    errors.image && (
                      <p className="text-red-500 text-sm font-semibold">
                        {errors.image.message}
                      </p>
                    )
                  }
              </div>
            </div>
            <div>
              <GlowButton
                type="submit"
                className="w-full mt-4 flex items-center justify-center text-lg border-teal-600 bg-teal-400 bg-opacity-10 hover:bg-opacity-20 hover:border-teal-400"
              >
                <PlusCircleIcon className="h-8 w-8" />
                Dodaj miejsce
              </GlowButton>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
