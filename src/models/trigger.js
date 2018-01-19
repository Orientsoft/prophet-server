import mongoose from 'mongoose';

const triggerSchema = new mongoose.Schema({
    name: String,
    type: Number,
    task: ObjectId,
    action: Number,
    target: ObjectId
}, { timestamps: true });

export default mongoose.model('Trigger', triggerSchema);
