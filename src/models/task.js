import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
    name: String,
    description: String,
    metric: String,
    input: mongoose.Schema.ObjectId,
    output: mongoose.Schema.ObjectId,
    script: String,
    params: Array,
    type: Number,
    cron: String,
    running: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model('Task', taskSchema);
