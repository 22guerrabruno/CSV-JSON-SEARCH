import File from '../models/file';

export const uploadDataTodb = async (
  data: Array<Record<string, string>>
): Promise<void> => {
  console.log(data, 'DATA************************');
  try {
    const response = await File.insertMany(data);
    console.log(response);
  } catch (error) {
    console.error(error);
  }
};
