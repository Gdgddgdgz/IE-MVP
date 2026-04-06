import mongoose from 'mongoose';

const CaregiverSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  specialty: { type: String, default: 'General Care' },
  availability: { type: Boolean, default: true },
  currentLocation: {
    lat: { type: Number },
    lng: { type: Number }
  },
  rating: { type: Number, default: 5 },
  reviews: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.models.Caregiver || mongoose.model('Caregiver', CaregiverSchema);
