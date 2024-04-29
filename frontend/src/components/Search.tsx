import { useEffect, useState } from 'react';
import { Data } from '../types';
import { searchData } from '../lib/search';
import { toast } from 'sonner';
import { useDebounce } from '@uidotdev/usehooks';

const DEBAUNCE_TIME = 300;

export const Search = ({ initialData }: { initialData: Data }) => {
  const [data, setData] = useState<Data>(initialData);

  const [search, setSearch] = useState<string>(() => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('q') || '';
  });
  const debouncedSearch = useDebounce(search, DEBAUNCE_TIME);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setSearch(e.target.value);
  };

  useEffect(() => {
    const newPathname =
      debouncedSearch === ''
        ? window.location.pathname
        : `?q=${debouncedSearch}`;

    window.history.pushState({}, '', newPathname);
  }, [debouncedSearch]);

  useEffect(() => {
    if (debouncedSearch === '') {
      setData(initialData);
      return;
    }
    searchData(debouncedSearch).then((response) => {
      const [err, newData] = response;
      if (err) {
        toast.error(err.message);
        return;
      }
      if (newData) {
        setData(newData);
      }
    });
  }, [debouncedSearch, initialData]);
  return (
    <div className='flex flex-col items-center justify-between gap-2 h-full   bg-gray-800 w-full'>
      <div className='flex flex-col items-center justify-center gap-2'>
        <div className='flex items-center justify-between w-full '>
          <h1 className='w-full flex justify-start  text-xl text-neutral-200 font-base'>
            Search
          </h1>
        </div>
        <form className='max-w-md mx-auto'>
          <label
            htmlFor='default-search'
            className='mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white'>
            Search
          </label>
          <div className='relative  w-[350px]'>
            <div className='absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none'>
              <svg
                className='w-4 h-4 text-gray-500 dark:text-gray-400'
                aria-hidden='true'
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 20 20'>
                <path
                  stroke='currentColor'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='2'
                  d='m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z'
                />
              </svg>
            </div>
            <input
              defaultValue={search}
              onChange={handleSearch}
              type='search'
              id='default-search'
              className='block w-full min-w-[150px] p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50
             focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600
              dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
              placeholder='Search info...'
              required
            />
            {/* <button
            type='submit'
            className='text-white absolute end-2.5 bottom-2.5
             bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none
              focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600
               dark:hover:bg-blue-700 dark:focus:ring-blue-800'>
            Search
          </button> */}
          </div>
        </form>
      </div>
      <div className=' bg-gray-800 mt-4'>
        <ul className=' flex flex-wrap justify-center items-center gap-2 m-auto'>
          {data.map((item) => (
            <li
              key={item.id}
              className='border min-w-fit w-[300px] border-neutral-300 p-4 rounded-md gap-4 bg-gray-700'>
              <article className=' '>
                <span className='text-sm text-gray-400 font-normal'>
                  Full Name
                </span>
                <h2 className='text-md font-semibold text-neutral-200'>
                  {item.nombre} {item.apellido}
                </h2>

                <span className='text-sm text-gray-400 font-normal'>Age:</span>
                <p className='text-md text-neutral-300'>{item.edad}</p>
                <span className='text-sm text-gray-400 font-normal'>
                  Department:
                </span>
                <p className='text-sm text-neutral-300'>{item.departamento}</p>
                <span className='text-sm text-gray-400 font-normal'>Email</span>
                <p className='text-md  text-neutral-300'>
                  <em>{item.email}</em>
                </p>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Search;
