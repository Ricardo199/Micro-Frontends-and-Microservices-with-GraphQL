const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
    name: {type: String, required: true, unique: true, default: ""},
    email: {type: String, required: true, unique: true, default: ""},
    password: {type: String, required: true, default: ""},
    role: {type: String, enum: ['resident', 'business_owner', 'community_organizer'], default: "user"},
    createdAt: {type: Date, default: Date.now},
}, {timestamps: true});

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

userSchema.methods.comparePassword = function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model("User", userSchema);

module.exports = User;