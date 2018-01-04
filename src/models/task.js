import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
    name: String,
    input: ObjectId,
    output: ObjectId,
    script: String,
    params: Array,
    type: Number,
    cron: String,
    ts: { type: Date, default: Date.now },
    running: Boolean
});

export default mongoose.model('Task', taskSchema);
