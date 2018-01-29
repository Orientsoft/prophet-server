import mongoose from 'mongoose';

const triggerSchema = new mongoose.Schema({
    name: String,
    type: Number,
    task: mongoose.SchemaTypes.ObjectId,
    action: Number,
    target: mongoose.SchemaTypes.ObjectId
}, { timestamps: true });

export default mongoose.model('Trigger', triggerSchema);
