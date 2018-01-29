import mongoose from 'mongoose';

const hostSchema = new mongoose.Schema({
    hostname: String,
    ip: String
}, { timestamps: true });

export default mongoose.model('Host', hostSchema);
