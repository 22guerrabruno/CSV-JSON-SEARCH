import express, { Request, Response } from 'express';
import cors from 'cors';
import multer from 'multer';
import csvToJson from 'convert-csv-to-json';
import File from './models/file';

import { connectDB } from './db';

import { uploadDataTodb } from './utils/uploadDataTodb';

const app = express(); // Create an Express app
app.use(cors()); // Enable CORS
const port = process.env.PORT ?? 3000; // PORT desde ENV y si no hay usa 3000
const storage = multer.memoryStorage(); // Multer memory storage
const upload = multer({ storage: storage }); // Multer upload middleware
let userData: Array<Record<string, string>> = [];

app.get('/api/getData', async (_req: Request, res: Response) => {
  try {
    const response = await File.find();
    return res.status(200).json({ data: response, message: 'Data fetched' });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Error processing file' });
  }
});

app.post(
  '/api/files',
  upload.single('file'),
  async (req: Request, res: Response) => {
    //1.Extract the file from the request
    const { file } = req;
    //2.Validate that we have a file
    if (!file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    //3. Validate the mimetype is (CSV)
    if (file.mimetype !== 'text/csv') {
      return res.status(400).json({ message: 'File must be a CSV' });
    }
    //4. Transform el File Buffer to a String
    let json: Array<Record<string, string>> = [];
    try {
      const fileBuffer = Buffer.from(file.buffer).toString('utf-8');
      console.log(fileBuffer);

      //5. Transform CSV String to JSON
      json = csvToJson.fieldDelimiter(',').csvStringToJson(fileBuffer);
      console.log(json);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: 'Error processing file' });
    }

    //6. Save the JSON to the DB
    userData = json; // Vamos a utilizar el user Data para enviar los datos a MongoDb
    console.log(userData, 'USER DATA FROM SERVER');
    await uploadDataTodb(userData);
    //7. Respond with the JSON and a 200 status code
    return res
      .status(200)
      .json({ data: json, message: 'File uploaded successfully' });
  }
); // Add the API routes to the Express app

app.get('/api/users', async (req: Request, res: Response) => {
  // 1.Extract the query parameters 'q' from the request
  const { q } = req.query;
  // 2. Validate that we have a query parameter 'q'
  if (!q) {
    return res.status(400).json({ message: 'Query parameter "q" is required' });
  }
  // 3.Filter the data from db with the query parameter 'q'
  // const search = q.toString().toLowerCase();
  // const filteredData = userData.filter((row) => {
  //   return Object.values(row).some((value) =>
  //     value.toLowerCase().includes(search)
  //   );
  // });

  try {
    const response = await File.find({
      $or: [
        { nombre: { $regex: `${q}`, $options: 'i' } },
        { apellido: { $regex: `${q}`, $options: 'i' } },
        { edad: { $regex: `${q}`, $options: 'i' } },
        { departamento: { $regex: `${q}`, $options: 'i' } },
        { email: { $regex: `${q}`, $options: 'i' } },
      ],
    });
    return res.status(200).json({ data: response, message: 'Filter Data' });
  } catch (error) {
    return res.status(400).json({ message: 'No data with that query' });
  }

  // 4. Return 200 with filtered Data
  //return res.status(200).json({ data: filteredData, message: 'Filter Data' });
});

app.get('/helper', (_req: Request, res: Response) => {
  res.send('Road to success is always under construction!').status(200);
});

const server = app.listen(port, async () => {
  console.log(`Server started on port ${port}`);

  await connectDB();
});
