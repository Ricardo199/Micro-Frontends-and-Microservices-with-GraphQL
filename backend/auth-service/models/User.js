const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
    username: {type: String, required: true, unique: true, default: ""},
    email: {type: String, required: true, unique: true, default: ""},
    password: {type: String, required: true, default: ""},
    role: {type: String, enum: ['resident', 'business_owner', 'community_organizer']},
    createdAt: {type: Date, default: Date.now},
    refreshToken: {type: String, default: null},
}, {timestamps: true});

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

userSchema.methods.generateAuthToken = function (secret) {
    const payload = { _id: this._id, username: this.username, email: this.email, role: this.role };
    const accessToken = require('jsonwebtoken').sign(payload, secret, { expiresIn: '15m' });
    
    const refreshToken = require('jsonwebtoken').sign(payload, secret, { expiresIn: '7d' });
    this.refreshToken = refreshToken;
    
    return accessToken;
};

userSchema.methods.comparePassword = function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model("User", userSchema);

module.exports = User;