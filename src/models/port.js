import mongoose from 'mongoose';

const portSchema = new mongoose.Schema({
    name: String,
    type: Number,
    ts: { type: Date, default: Date.now }
});

export default mongoose.model('Port', portSchema);
