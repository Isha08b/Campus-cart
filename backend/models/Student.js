import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  collegeId: { type: String, required: true, unique: true },
  semester: { type: Number, required: true }, // 👈 Check the type
  password: { type: String, required: true },
});

const Student = mongoose.model('Student', studentSchema);

export default Student;