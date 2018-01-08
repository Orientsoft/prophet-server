import mongoose from 'mongoose';

const portSchema = new mongoose.Schema({
    name: String,
    type: Number
}, { timestamps: true });

export default mongoose.model('Port', portSchema);
