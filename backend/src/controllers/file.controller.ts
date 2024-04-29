import { Request, Response } from 'express';

export const useFile = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).send('No file uploaded');
      return;
    }

    res.status(200).send('File uploaded successfully');
  } catch (error) {
    res.status(500).send(error.message);
  }
};
