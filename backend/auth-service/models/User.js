import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const userSchema = new mongoose.Schema({
    username: {type: String, required: true, unique: true, default: ""},
    email: {type: String, required: true, unique: true, default: ""},
    password: {type: String, required: true, default: ""},
    role: {type: String, enum: ['resident', 'business_owner', 'community_organizer']},
    createdAt: {type: Date, default: Date.now},
    refreshToken: {type: String, default: null},
}, {timestamps: true});


userSchema.methods.generateAuthToken = function (secret) {
    const payload = { _id: this._id, username: this.username, email: this.email, role: this.role };
    const accessToken = jwt.sign(payload, secret, { expiresIn: '15m' });
    
    const refreshToken = jwt.sign(payload, secret, { expiresIn: '7d' });
    this.refreshToken = refreshToken;
    
    return { accessToken, refreshToken };
};

userSchema.methods.verifyAuthToken = function (token, secret) {
    if(this.refreshToken !== token) return false;
    try {
        jwt.verify(token, secret);
        return true;
    } catch (err) {
        return false;
    }
};

userSchema.methods.generateNewAccessToken = function (secret) {
    if (!this.refreshToken) throw new Error('No refresh token available');
    try {
        const payload = jwt.verify(this.refreshToken, secret);
        const newAccessToken = jwt.sign(payload, secret, { expiresIn: '15m' });
        return { accessToken: newAccessToken, refreshToken: this.refreshToken, user: payload };
    } catch (err) {
        throw new Error('Invalid refresh token');
    }
};

userSchema.methods.comparePassword = function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;