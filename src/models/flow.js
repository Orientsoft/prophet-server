import mongoose from 'mongoose';

const flowSchema = new mongoose.Schema({
    name: String,
    tasks: Array,
    ts: { type: Date, default: Date.now }
});

export default mongoose.model('Flow', flowSchema);
