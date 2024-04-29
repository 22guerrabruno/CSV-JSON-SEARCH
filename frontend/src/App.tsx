import { useEffect, useState } from 'react';
import { uploadFile } from './lib/upload-file';
import { Toaster, toast } from 'sonner';
import Search from './components/Search';
import axios from 'axios';

const APP_STATUS = {
  IDLE: 'idle',
  ERROR: 'error',
  READY_TO_UPLOAD: 'ready_to_upload',
  UPLOADING: 'uploading',
  READY_TO_FILTER: 'ready_to_filter',
} as const;

const BUTTON_TEXT = {
  [APP_STATUS.READY_TO_UPLOAD]: 'Upload File',
  [APP_STATUS.UPLOADING]: 'Uploading...',
} as const;

type AppstatusType = (typeof APP_STATUS)[keyof typeof APP_STATUS];

function App() {
  const [appStatus, setAppStatus] = useState<AppstatusType>(APP_STATUS.IDLE);
  const [file, setFile] = useState<File | null>(null);
  const [data, setData] = useState<Record<string, string>[]>([]);
  const [showInput, setShowInput] = useState<boolean>(true);

  const toggleInput = () => {
    setShowInput((prev) => !prev);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/getData');
        console.log(response, 'response');
        if (response.status !== 200) {
          toast.error('No data to fetch');
          setAppStatus(APP_STATUS.IDLE);
          return;
        }
        console.log(response.data.data, 'response.data.data');
        setData(response.data.data);
        setAppStatus(APP_STATUS.READY_TO_FILTER);
      } catch (error) {
        console.log(error);
        toast.error('Error fetching data');
        setAppStatus(APP_STATUS.ERROR);
        return;
      }
    };
    fetchData();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const [file] = e.target?.files ?? [];
    console.log('File uploaded', file);
    if (!file) {
      return;
    }
    setFile(file);
    setAppStatus(APP_STATUS.READY_TO_UPLOAD);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (appStatus !== APP_STATUS.READY_TO_UPLOAD || !file) {
      return;
    }
    setAppStatus(APP_STATUS.UPLOADING);

    const [err, uploadedData] = await uploadFile(file);
    if (err) {
      toast.error(err.message);
      setAppStatus(APP_STATUS.ERROR);
      return;
    }
    if (uploadedData) {
      setAppStatus(APP_STATUS.READY_TO_FILTER);
      console.log('Data uploaded', uploadedData);
      setData(uploadedData);
    }
  };

  const showButton =
    appStatus === APP_STATUS.READY_TO_UPLOAD ||
    appStatus === APP_STATUS.UPLOADING;

  //const showInput = appStatus !== APP_STATUS.READY_TO_FILTER;

  const showSearch = appStatus === APP_STATUS.READY_TO_FILTER;
  return (
    <div className='w-full flex flex-col h-screen  gap-6 bg-gray-800 '>
      <form
        className='  flex flex-col items-center justify-center gap-3 max-w-md mx-auto mt-6'
        onSubmit={handleSubmit}>
        <div className='  flex flex-col marker:items-center justify-center w-full'>
          <div className='mb-6 w-full flex flex-col items-center justify-center'>
            <h1 className='  text-4xl font-base text-neutral-200 mb-1'>
              Ingresa tu archivo CSV
            </h1>
            <p className='  text-sm font-base text-neutral-200 w-full'>
              Campos - nombre, apellido, edad, departamento y email podras
              buscar en ellos sin importar mayusculas y minusculas por todos los
              campos
            </p>
          </div>
          {showInput && (
            <label
              htmlFor='dropzone-file'
              className='flex flex-col items-center justify-center w-full border-2
             border-gray-300 border-dashed rounded-lg cursor-pointer
             bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100
              dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600 mb-2'>
              <div className=' relative flex flex-col items-center justify-center px-16 py-6'>
                <svg
                  className='w-8 h-8 mb-4 text-gray-500 dark:text-gray-400'
                  aria-hidden='true'
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 20 16'>
                  <path
                    stroke='currentColor'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    d='M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2'
                  />
                </svg>
                {!file ? (
                  <>
                    <p className='mb-2 text-sm text-gray-500 dark:text-gray-400'>
                      <span className='font-semibold'>Click to upload</span> or
                      drag and drop
                    </p>
                    <p className='text-xs text-gray-500 dark:text-gray-400'>
                      CSV
                    </p>
                  </>
                ) : (
                  <div className=' flex items-center justify-center w-full p-8 '>
                    <p className=' text-2xl text-neutral-200 border border-blue-600 p-6 rounded-lg'>
                      {file?.name}
                    </p>
                    <p
                      className='absolute -top-6 -right-6  text-neutral-200 cursor-pointer'
                      onClick={(e) => {
                        e.stopPropagation();
                        setFile(null);
                        setAppStatus(APP_STATUS.IDLE);
                      }}>
                      X
                    </p>
                  </div>
                )}
              </div>
              <input
                onChange={handleInputChange}
                id='dropzone-file'
                type='file'
                accept='.csv'
                name='file'
                className='hidden'
              />
            </label>
          )}
          <button
            className=' text-md font-base text-neutral-200 border border-neutral-100 w-full py-2 px-4 
            rounded-md'
            onClick={toggleInput}>
            {showInput ? 'Hide Input' : 'Show Input'}
          </button>
        </div>

        {showButton && (
          <button
            disabled={appStatus === APP_STATUS.UPLOADING}
            type='submit'
            className='text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 
            font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 
            focus:outline-none dark:focus:ring-blue-800 w-full disabled:pointer-events-none'>
            {BUTTON_TEXT[appStatus]}
          </button>
        )}
      </form>

      {showSearch && <Search initialData={data} />}
      <Toaster />
    </div>
  );
}

export default App;
