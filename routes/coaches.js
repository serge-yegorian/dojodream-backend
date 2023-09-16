import express from "express";
import { CoachModel } from "../models/coach.js";
import { GymModel } from "../models/gym.js";
import upload from "../utils/multer.js";
import { cloudinary } from "../utils/cloudinary.js";

const router = express.Router();

//create new coach
router.post("/newcoach", upload.single("image"), (req, res) => {
  const image = req.file.path;
  const gymAddress = req.body.gymAddress;
  cloudinary.uploader
    .upload(image, { upload_preset: "hv1rhgsz" })   
    .then((response) => {
      const newCoach = new CoachModel({
        image: response,
        name: req.body.name,
        bio: req.body.bio,
        insta: req.body.insta,
        facebook: req.body.facebook,
        smoothcomp: req.body.smoothcomp,
        tapology: req.body.tapology,
        gym: req.body.gymAddress,
      });
      newCoach
        .save()
        .then((coach) => {
          console.log(coach);
          res.json(coach);
          GymModel.findById(gymAddress)
            .then((gym) => {
              if (!gym) {
                return res.status(404).json({ error: "Gym not found" });
              }

              // Step 2: Add the coach to the coaches array
              gym.coaches.push(coach._id);

              // Step 3: Save the updated Gym document
              return gym.save();
            })
            .catch((error) => {
              // Handle errors, e.g., database errors
              console.error(error);
              return res.status(500).json({ error: "Internal server error" });
            });
        })
        .catch(() => {
          res.status(400).json({ error: "Failed to create a new gym" });
        });
    });
});

//find coaches based on ids
router.post("/findcoaches", (req, res) => {
    const ids = req.body;
    console.log(ids)
    CoachModel.find({ _id: { $in: ids } })
    .then((coaches) => {
      res.json(coaches);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    });
})

//find coahc by id
router.get("/:id", (req, res)=>{
    console.log(req.params.id)
    CoachModel.findOne({ _id: req.params.id })
    .then((coach) => {
    res.status(200).json(coach);
    })
    .catch((err) => res.status(400).json({ error: `Error retrieving coach: ${err}` }));

})

//update coach by id
router.post("/updatecoach", upload.single("image"), (req, res)=>{
    const image = req.file
    console.log(image)
    const coachId = req.body.coachId
    const publicId = req.body.publicId
    console.log(req.body.name)
    if (image) {
        cloudinary.uploader
    .upload(image.path, { upload_preset: "hv1rhgsz" })
    .then((response) => {
        CoachModel.findByIdAndUpdate(coachId, { 
            name: req.body.name,
            bio: req.body.bio,
            insta: req.body.insta,
            facebook: req.body.facebook,
            smoothcomp: req.body.smoothcomp,
            tapology: req.body.tapology, 
            image: response
        }, { new: true })
              .then((updatedCoach) => {
                res.json(updatedCoach)
                publicId && cloudinary.uploader.destroy(publicId)
                .then(result => {
                console.log('Image deleted:', result);
                })
                .catch(error => {
                    console.error('Error deleting image:', error);
                });
              })
              .catch(() => {
                res.status(500).send("step2.");
              });
            })
        }
    if (!image) {
        CoachModel.findByIdAndUpdate(coachId, { 
            name: req.body.name,
            bio: req.body.bio,
            insta: req.body.insta,
            facebook: req.body.facebook,
            smoothcomp: req.body.smoothcomp,
            tapology: req.body.tapology, 
        }, { new: true })
              .then((updatedCoach) => {
                res.json(updatedCoach)
                publicId && cloudinary.uploader.destroy(publicId)
                .then(result => {
                console.log('Image deleted:', result);
                })
                .catch(error => {
                    console.error('Error deleting image:', error);
                });
              })
              .catch(() => {
                res.status(500).send("step2.");
              });
    }
})

//delete coach
router.post("/deletecoach", (req, res)=>{
    const coachId = req.body.coachId
    CoachModel.findByIdAndDelete(coachId)
    .then((response)=>{
        res.json(response)
        console.log('coach is deleted')
    })
    .catch(()=>{
        res.status(500).send("COULD NOT DELETE THE COACH...");
    })
})

export { router as coachRouter };
