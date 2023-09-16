import mongoose from 'mongoose';

const CoachSchema = new mongoose.Schema({
    name: {type: String, required: false},
    bio: {type: String, required: false},
    image: {
        type: {},
        required: false,
    },
    insta: {type: String, required: false},
    facebook: {type: String, required: false},
    smoothcomp: {type: String, required: false},
    tapology: {type: String, required: false},
    gym: {type: mongoose.Schema.Types.ObjectId, ref: "Gym", required: true},
})


export const CoachModel = mongoose.model('Coach', CoachSchema);

