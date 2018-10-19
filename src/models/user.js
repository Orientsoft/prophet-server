import mongoose from 'mongoose';


export const RoleType = {
    ADMIN: 1,
    DEFAULT: 2,
    DEVELOPER: 4,
};

const userSchema = new mongoose.Schema({
    username: { type: String },
    password: { type: String },
    createdAt: { type: Date, default: Date.now },
    role: { type: Number, default: RoleType.DEFAULT },
    menus: { type: [] }
}, { collection: 'users' });

userSchema.methods.validatePassword = function validatePassword(password) {
    return this.get('password') === password;
};

export default mongoose.model('User', userSchema);
