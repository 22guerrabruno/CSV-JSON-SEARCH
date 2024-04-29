import { ApiSearchResponse, Data } from '../types';

export const searchData = async (search: string): Promise<[Error?, Data?]> => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/api/users?q=${search}`
    );
    if (!response.ok) {
      return [new Error(`Error searching data: ${response.statusText}`)];
    }
    const json = (await response.json()) as ApiSearchResponse;
    return [undefined, json.data];
  } catch (error: unknown) {
    if (error instanceof Error) {
      return [error];
    }
    return [new Error('An unexpected error occurred')];
  }
};
