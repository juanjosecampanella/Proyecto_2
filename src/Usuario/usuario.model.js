import { Schema, model } from 'mongoose';

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    mail: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String, required: true, unique: true },
    address: { type: String, required: true },
    role: {
      type: String,
      required: true,
      enum: ['cliente', 'domiciliario', 'administrador de restaurante'],
    },
    active: Boolean,
  },
  {
    timestamps: true,
  }
);

const usuarioModel = model('users', userSchema);
export default usuarioModel;