/* eslint-disable max-len */
import {ArrowLeftIcon, ArrowRightOnRectangleIcon, UserPlusIcon} from '@heroicons/react/24/outline';
import {Link} from 'react-router-dom';
import {useForm} from 'react-hook-form';
import axios from 'axios';
import styles from '../styles/hero.module.scss';

export default function SignupView() {
  const {register, handleSubmit, formState: {errors}} = useForm();

  const onSubmit = (data: any) => {
    axios.post(`${import.meta.env.VITE_API_URL}/user/register`, data)
      .then((res) => {
        console.log(res);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  return (
    <div className={`min-h-screen pt-2 md:pt-20 ${styles.background}`}>
      <div className="container mx-auto p-2">
        <div className="flex mb-10 select-none ml-1 md:ml-0">
          <Link to="/" className="flex flex-row items-center gap-2">
            <ArrowLeftIcon className="w-5 h-5 text-slate-300" />
            <h1 className="text-md font-secondary leading-snug text-slate-300">
              Wróć
            </h1>
          </Link>
        </div>
        <div className="flex flex-col mt-20">
          <h1 className="text-5xl font-bold font-secondary">Załóż konto</h1>
          <h2 className="text-lg font-regular mt-2">
            Masz już konto?
            {' '}
            <Link to="/login" className="text-indigo-400 font-semibold">Zaloguj się</Link>
          </h2>
          <form className="flex flex-col gap-2 mt-4 max-w-sm" onSubmit={handleSubmit(onSubmit)}>
            <input
              type="text"
              placeholder="Imię"
              className={`p-2 rounded-md bg-slate-800 border border-indigo-800 focus:outline-none focus:border-indigo-500 ${errors.first_name ? 'border-red-800 focus:border-red-500' : ''}`}
              {...register('first_name', {required: true})}
              aria-invalid={errors.first_name ? 'true' : 'false'}
            />
            {
              errors.first_name && (
                <p className="text-red-500 text-sm font-semibold">
                  Imię jest wymagane
                </p>
              )
            }
            <input
              type="text"
              placeholder="Nazwisko"
              className={`p-2 rounded-md bg-slate-800 border border-indigo-800 focus:outline-none focus:border-indigo-500 ${errors.last_name ? 'border-red-800 focus:border-red-500' : ''}`}
              {...register('last_name', {required: true})}
              aria-invalid={errors.last_name ? 'true' : 'false'}
            />
            <input
              type="text"
              placeholder="Email"
              className={`p-2 rounded-md bg-slate-800 border border-indigo-800 focus:outline-none focus:border-indigo-500 ${errors.email ? 'border-red-800 focus:border-red-500' : ''}`}
              {...register('email', {pattern: /^\S+@\S+$/i, required: true})}
              aria-invalid={errors.email ? 'true' : 'false'}
            />
            <input
              type="password"
              placeholder="Hasło"
              className={`p-2 rounded-md bg-slate-800 border border-indigo-800 focus:outline-none focus:border-indigo-500 ${errors.password ? 'border-red-800 focus:border-red-500' : ''}`}
              {...register('password', {required: true})}
              aria-invalid={errors.password ? 'true' : 'false'}
            />
            <button
              type="submit"
              className="p-2 rounded-md bg-indigo-800 text-white font-semibold flex flex-row justify-center items-center gap-2"
            >
              <UserPlusIcon className="w-5 h-5" />
              Zarejestruj się!
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
