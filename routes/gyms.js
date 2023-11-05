import express from 'express';
import {GymModel} from '../models/gym.js';
import upload from '../utils/multer.js';
import {cloudinary} from '../utils/cloudinary.js';

const router = express.Router()

//create gym
router.post('/creategym', (req, res) => {
    console.log(req.body)
    const newGym = new GymModel(req.body)
    newGym
    .save()
    .then((gym)=>{
        console.log(gym)
        console.log('gym is added!!!!!')
        res.json(gym)
    })
    .catch(() => {
        res.status(400).json({ error: "Failed to create a new gym" });
    });
})

//get a gym
router.get('/:id', (req, res) => {
    GymModel.findOne({ _id: req.params.id })
    .then((gym) => {
    if (!gym) {
        return res.status(404).json({ error: "Gym not found" });
    }
    res.status(200).json(gym);
    })
    .catch((err) => res.status(400).json({ error: `Error retrieving gym: ${err}` }));
});

//get my gyms
router.get('/mygyms/:id', (req, res) => {
    const userId = req.params.id;
    GymModel.find({gymOwner: userId})
    .then((gyms) => {
        res.json(gyms)
    })
    .catch((error) => {
        res.status(500).json({ error: "Failed to find gyms" });
    });
})

// find gyms near you
router.post('/find', async (req, res) => {
    const userLat = parseFloat(req.body.lat);
    const userLng = parseFloat(req.body.lng);
    const maxDistance = 50 * 1609.34; // Convert max distance to meters

    try {
        const nearbyGyms = await GymModel.find({
            location: {
                $near: {
                    $geometry: {
                        type: 'Point',
                        coordinates: [userLng, userLat], // MongoDB stores coordinates as [lng, lat]
                    },
                    $maxDistance: maxDistance,
                },
            },
        }).exec();

        res.status(200).json(nearbyGyms);
    } catch (err) {
        res.status(400).json({ error: `Error retrieving nearby gyms: ${err.message}` });
    }
});

// update/upload logo
router.post('/uploadLogo', upload.single("logo"), (req, res) => {
    console.log(req.file);
    console.log(req.body);
    const logo = req.file;
    const gymAddress = req.body.gymAddress;
    const publicId = req.body.logoPublicId; // for deleting
    //Upload Image to cloudinary
    cloudinary.uploader.upload(logo.path, {upload_preset: 'hv1rhgsz'}) 
    .then((response) => {
        //replace image data in MONGO DB
        GymModel.findByIdAndUpdate(gymAddress, { logo: response }, { new: true })
          .then((updatedGym) => {
            res.json(updatedGym)
            // delete old image
            publicId && cloudinary.uploader.destroy(publicId)
            .then(result => {
                console.log('Image deleted:', result);
            })
            .catch(error => {
                console.error('Error deleting image:', error);
            });
          })
          .catch((err) => {
            console.log(err);
            res.status(500).send("Error updating gym logo.");
          });
        
    })
    .catch((err) => {
        console.log(err);
        res.status(500).json({ error: 'Error uploading the image' });
    });
});

// update/upload background
router.post('/uploadBackground', upload.single("background"), (req, res) => {
    const background = req.file;
    const gymAddress = req.body.gymAddress;
    const publicId = req.body.backgroundPublicId; // for deleting
    //Upload Image to cloudinary
    cloudinary.uploader.upload(background.path, {upload_preset: 'hv1rhgsz'}) 
    .then((response) => {
        //replace image data in MONGO DB
        GymModel.findByIdAndUpdate(gymAddress, { background: response }, { new: true })
          .then((updatedGym) => {
            res.json(updatedGym)
            // delete old image
            publicId && cloudinary.uploader.destroy(publicId)
            .then(result => {
                console.log('Image deleted:', result);
            })
            .catch(error => {
                console.error('Error deleting image:', error);
            });
          })
          .catch((err) => {
            console.log(err);
            res.status(500).send("Error updating gym background.");
          });
        
    })
    .catch((err) => {
        console.log(err);
        res.status(500).json({ error: 'Error uploading the image' });
    });
});

// update/upload schedule
router.post('/uploadSchedule', upload.single("schedule"), (req, res) => {
    const schedule = req.file;
    const gymAddress = req.body.gymAddress;
    const publicId = req.body.schedulePublicId; // for deleting
    //Upload Image to cloudinary
    cloudinary.uploader.upload(schedule.path, {upload_preset: 'hv1rhgsz'}) 
    .then((response) => {
        //replace image data in MONGO DB
        GymModel.findByIdAndUpdate(gymAddress, { schedule: response }, { new: true })
          .then((updatedGym) => {
            res.json(updatedGym)
            // delete old image
            publicId && cloudinary.uploader.destroy(publicId)
            .then(result => {
                console.log('Image deleted:', result);
            })
            .catch(error => {
                console.error('Error deleting image:', error);
            });
          })
          .catch((err) => {
            console.log(err);
            res.status(500).send("Error updating gym schedule.");
          });
        
    })
    .catch((err) => {
        console.log(err);
        res.status(500).json({ error: 'Error uploading the image' });
    });
});

//update name and bio
router.post('/editnameandbio', (req, res) => {
    const name = req.body.name;
    const bio = req.body.bio;
    const gymAddress = req.body.gymAddress;
    GymModel.findByIdAndUpdate(gymAddress, { name, bio }, { new: true })
          .then((updatedGym) => {
            res.json(updatedGym)
          })
          .catch(() => {
            res.status(500).send("Error updating gym schedule.");
          });
    
})

//update phone and email
router.post('/editphoneandemail', (req, res) => {
    const phone = req.body.phone;
    const email = req.body.email;
    const gymAddress = req.body.gymAddress;
    GymModel.findByIdAndUpdate(gymAddress, { phone, email }, { new: true })
          .then((updatedGym) => {
            res.json(updatedGym)
          })
          .catch(() => {
            res.status(500).send("Error updating gym schedule.");
          });
    
})

//update media links
router.post('/addlinks', (req, res) => {
    const website = req.body.website;
    const insta = req.body.insta;
    const facebook = req.body.facebook;
    const smoothcomp = req.body.smoothcomp;
    const tapology = req.body.tapology;
    const gymAddress = req.body.gymAddress;
    GymModel.findByIdAndUpdate(gymAddress, { website, insta, facebook, smoothcomp, tapology }, { new: true })
          .then((updatedGym) => {
            res.json(updatedGym)
          })
          .catch(() => {
            res.status(500).send("Error updating gym schedule.");
          });
})

//edit address
router.post('/editaddress', (req, res) => {
    const state = req.body.state;
    const city = req.body.city;
    const street = req.body.street;
    const zip = req.body.zip;
    const location = req.body.location;
    const gymAddress = req.body.gymAddress;
    GymModel.findByIdAndUpdate(gymAddress, { state, city, street, zip, location }, { new: true })
          .then((updatedGym) => {
            res.json(updatedGym)
          })
          .catch(() => {
            res.status(500).send("Error updating gym schedule.");
          });
})

//delete gym
router.post("/deletegym", (req, res)=>{
    const gymAddress = req.body.gymAddress
    GymModel.findByIdAndDelete(gymAddress)
    .then((response)=>{
        res.json(response)
        console.log('gym is deleted')
    })
    .catch(()=>{
        res.status(500).send("COULD NOT DELETE THE GYM...");
    })
})


export { router as gymRouter}