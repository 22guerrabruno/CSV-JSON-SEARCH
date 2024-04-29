import React from 'react';

const FileInput = () => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const [file] = e.target?.files ?? [];
    console.log('File uploaded', file);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Form submitted');
  };

  return (
    <div className='w-full flex flex-col justify-center items-center h-full gap-6'>
      <h1 className='text-4xl font-base text-neutral-200'>
        Ingresa tu archivo CSV
      </h1>
      <form
        className='flex flex-col items-center justify-center gap-3'
        onSubmit={handleSubmit}>
        <div className='flex items-center justify-center w-full'>
          <label
            htmlFor='dropzone-file'
            className='flex flex-col items-center justify-center w-full border-2
             border-gray-300 border-dashed rounded-lg cursor-pointer
             bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100
              dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600'>
            <div className='flex flex-col items-center justify-center px-16 py-6'>
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
              <p className='mb-2 text-sm text-gray-500 dark:text-gray-400'>
                <span className='font-semibold'>Click to upload</span> or drag
                and drop
              </p>
              <p className='text-xs text-gray-500 dark:text-gray-400'>CSV</p>
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
        </div>
        <button
          className='text-white bg-blue-700 hover:bg-blue-800 focus:ring-4
           focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600
            dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 w-full'
          type='submit'>
          Subir Archivo
        </button>
      </form>
    </div>
  );
};

export default FileInput;
