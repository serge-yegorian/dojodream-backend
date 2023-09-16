import mongoose from "mongoose";

const GymSchema = new mongoose.Schema({
    name: {type: String, required: true},
    bio: {type: String, required: true},
    email: {type: String, required: true},
    phone: {type: String, required: true},
    logo: {
        type: {},
        required: false,
    },
    background: {
        type: {},
        required: false,
    },
    schedule: {
        type: {},
        required: false,
    },
    street: {type: String, required: true},
    city: {type: String, required: true},
    state: {type: String, required: true},
    zip: {type: String, required: true},
    location: {
        type: {
            type: String,
            enum: ['Point'],
            required: true,
        },
        coordinates: {
            type: [Number], // Array of numbers: [longitude, latitude]
            required: true,
        },
    },
    website: {type: String, required: false},
    insta: {type: String, required: false},
    facebook: {type: String, required: false},
    tapology: {type: String, required: false},
    smoothcomp: {type: String, required: false},
    gymOwner: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
    coaches: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    isApproved: {type: Boolean, default: false}

})
GymSchema.index({ location: '2dsphere' });

export const GymModel = mongoose.model('Gym', GymSchema);
