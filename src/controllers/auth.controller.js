// flow of auth
//  1) sending otp to email
// 2) verify otp
// 3) generating jwt token

import {User} from "../models/user.model.js"
import jwt from "jsonwebtoken"
import nodemailer from "nodemailer"
import {asyncHandler} from "../utils/asyncHandler.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import dotenv from "dotenv"
dotenv.config();

const otpStore = new Map(); // key-value pairs  > email : otp

const sendOtp = asyncHandler(async (req, res) => {
      
    const {email} = req.body;
     console.log("email is:", email)
     
    if(!email){
         throw new ApiError(400, "email is required")
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    otpStore.set(email, otp);

    // send email via nodemailer
     const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL,
            pass: process.env.EMAIL_PASS,
        }
     })

     const mailOptions = {
         from: process.env.EMAIL,
         to: email,
         subject: "Your otp for Ticket Dashboard Login",
         text: `Your otp is ${otp}`,
     }

     try {
         transporter.sendMail(mailOptions);
          return res
          .status(201)
          .json(new ApiResponse(201, mailOptions, "Otp sent successfully"))
   
     } catch (error) {
         console.log("Error while sending email:", error);
         throw new ApiError(500, "failed to send otp")
     }
})

// verify otp and login

const verifyOtp = asyncHandler(async (req, res) => {
       const {email, otp} = req.body;

       const storedOtp = otpStore.get(email);
       console.log("stored otp is:", storedOtp)
        if(!storedOtp || storedOtp != otp){
             throw new ApiError(400, "Invalid Otp",)
        }

        // lets remove otp after use
        otpStore.delete(email);

        // find or create user

        let user = await User.findOne({email});

         console.log("user is:", user)
         if(!user){
             user = await User.create({email});
         }

        //  generate jwt
         const token = jwt.sign(
            {email}, 
          process.env.JWT_SECRET,
          {expiresIn: "1d"}
         )

         return res
         .status(201)
         .json(new ApiResponse(201, {token, user}, "Login Successful"))



})

export {
     sendOtp,
     verifyOtp,
}