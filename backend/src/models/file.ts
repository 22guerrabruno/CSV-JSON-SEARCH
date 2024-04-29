import mongoose from 'mongoose';

const fileSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  apellido: { type: String, required: true },
  edad: { type: String, required: true },
  departamento: { type: String, required: true },
  email: { type: String, required: true },
});

export default mongoose.model('File', fileSchema);
