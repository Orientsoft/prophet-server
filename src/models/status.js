import mongoose from 'mongoose';

const statusSchema = new mongoose.Schema({
    source: ObjectId,
    code: Number,
    level: Number,
    content: String,
    ts: { type: Date, default: Date.now }
});

export default mongoose.model('Status', statusSchema);
