import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import {UserModel} from '../models/user.js';


const router = express.Router();
const secret = 'h107serge087xxb!nsdnumber1';

//login
router.post('/login', (req, res) => {
    const { username, password } = req.body;
    UserModel.findOne({ username })
        .then((user) => {
            // check if there is a user
            if (!user) {
                res.status(401).json({ error: 'Username not found' });
                return;
            }
            // check if password mathces the one in the database
            const passOk = bcrypt.compareSync(password, user.password);
            if (passOk) {
                // get a cookie if ok
                jwt.sign({ username, id: user._id }, secret, {}, (err, token) => {
                    if (err) throw err;
                    res.cookie('token', token, { httpOnly: true }).json(token)
                });
            } else {
                // error if not okay
                res.status(402).json({ error: 'Wrong password' });
            }
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json({ error: 'An error occurred during log in' });
        });
});

//register
router.post('/register', (req, res) => {
    const {username, password} = req.body; 
        UserModel.create({
            username,
            password: bcrypt.hashSync(password, 10)
        }).then(() => {
            //console.log for vscode
            console.log(`User Created! Username is: ${username}`)
            //res.json for browser preview
            res.json({message: `User Created Succesfully With The Username: ${username}`})
        }).catch((err) => {
            //console.log for vscode
            console.log(`Username Is Taken: ${err}`)
            //res.json for browser preview
            res.status(400).json('Username Is Taken, Try Different One')
        })
    
})

//check if logged in
router.post('/profile', (req, res) => {
    // grab token (id) from request
    const { id } = req.body;
    //check if our token is the jwt token
    jwt.verify(id, secret, (err, decoded_token) => {
        if (err) {
            res.status(401).json({ error: err.message });
        } else {
            res.json(decoded_token);
            console.log(decoded_token);
        }
    });
});


export { router as userRouter };