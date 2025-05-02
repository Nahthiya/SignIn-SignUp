import mongoose from 'mongoose';

const googleTokensSchema = new mongoose.Schema({
  access:     String,
  refresh:    String,
  expiryDate: Date,
}, { _id: false });

const UserSchema = new mongoose.Schema({
  // personal
  name:     { type: String, required: true },
  email:    { type: String, required: true, unique: true },
  phone:    { type: String },                    

  // company
  companyName:    { type: String, required: true },
  companyEmail:   { type: String, required: true },
  companyAddress: { type: String },              

  // auth
  password:          { type: String, required: true },
  isConfirmed:       { type: Boolean, default: false },
  confirmationToken: { type: String },

  googleTokens: googleTokensSchema,
}, { timestamps: true });

export default mongoose.model('User', UserSchema);
