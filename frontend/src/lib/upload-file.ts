import { ApiUploadResponse, Data } from '../types';

export const uploadFile = async (file: File): Promise<[Error?, Data?]> => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/api/files`,
      {
        method: 'POST',
        body: formData,
      }
    );
    if (!response.ok) {
      return [new Error(`Failed to upload file: ${response.statusText}`)];
    }
    const json = (await response.json()) as ApiUploadResponse;
    return [undefined, json.data];
  } catch (error: unknown) {
    if (error instanceof Error) {
      return [error];
    }
    return [new Error('An unexpected error occurred')];
  }
};
