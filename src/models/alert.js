import mongoose from 'mongoose';

const alertSchema = new mongoose.Schema({
    structure: Array,
    esIndex: String
}, { timestamps: true });

export default mongoose.model('Alert', alertSchema);
