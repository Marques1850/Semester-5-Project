import { IUserPersistence } from '../../dataschema/IUserPersistence';
import mongoose from 'mongoose';

const User = new mongoose.Schema(
  {
    domainId: { 
      type: String,
      unique: true
    },

    firstName: {
      type: String,
      required: [true, 'Please enter first name'],
      index: true,
    },

    lastName: {
      type: String,
      required: [true, 'Please enter last name'],
      index: true,
    },

    phoneNumber: {
      type: String,
      required: [true, 'Please enter phone number'],
      index: true,
    },

    taxpayerNumber: {
      type: String,
      required: [false, 'Please enter taxpayer number'],
      index: true,
    },

    email: {
      type: String,
      lowercase: true,  
      unique: true,
      index: true,
    },

    password: String,

    salt: String,

    role: {
      type: String,
      default: 'user',
    },

    estado: {
      type: String,
      default: 'pendente',
    },
  },
  { timestamps: true },
);

export default mongoose.model<IUserPersistence & mongoose.Document>('User', User);
