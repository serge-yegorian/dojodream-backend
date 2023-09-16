// cloudinary.js
import { v2 as cloudinaryV2 } from 'cloudinary';
import { config as dotenvConfig } from 'dotenv';
dotenvConfig();

cloudinaryV2.config({
    cloud_name: process.env.REACT_APP_CLOUD_NAME,
    api_key: process.env.REACT_APP_API_KEY,
    api_secret: process.env.REACT_APP_API_SECRET
});

export { cloudinaryV2 as cloudinary };



