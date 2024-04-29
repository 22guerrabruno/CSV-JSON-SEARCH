import { Router } from 'express';
import { useFile } from '../controllers/file.controller';
import multer from 'multer';

const upload = multer({ dest: 'uploads/' });
const router = Router();

router.post('/file', upload.single('file'), useFile);

export default router;
