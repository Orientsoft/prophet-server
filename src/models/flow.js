import mongoose from 'mongoose';

const flowSchema = new mongoose.Schema({
    name: String,
    tasks: Array
}, { timestamps: true });

export default mongoose.model('Flow', flowSchema);
