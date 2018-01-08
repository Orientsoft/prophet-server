import mongoose from 'mongoose';

const statusSchema = new mongoose.Schema({
    source: mongoose.Schema.ObjectId,
    code: Number,
    level: Number,
    content: String
}, { timestamps: true });

export default mongoose.model('Status', statusSchema);
