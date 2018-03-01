import mongoose from 'mongoose';

const statusSchema = new mongoose.Schema({
    source: { type: mongoose.Schema.ObjectId, index: true },
    code: { type: Number, index: true },
    level: { type: Number, index: true },
    content: String
}, { timestamps: true });

export default mongoose.model('Status', statusSchema);
