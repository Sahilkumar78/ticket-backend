// // flow of auth
// //  1) sending otp to email
// // 2) verify otp
// // 3) generating jwt token

// import {User} from "../models/user.model.js"
// import jwt from "jsonwebtoken"
// import nodemailer from "nodemailer"
// import {asyncHandler} from "../utils/asyncHandler.js"
// import {ApiError} from "../utils/ApiError.js"
// import {ApiResponse} from "../utils/ApiResponse.js"
// import dotenv from "dotenv"
// dotenv.config();

// const otpStore = new Map(); // key-value pairs  > email : otp

// const sendOtp = asyncHandler(async (req, res) => {
      
//     const {email} = req.body;
//      console.log("email is:", email)
     
//     if(!email){
//          throw new ApiError(400, "email is required")
//     }

//     const otp = Math.floor(100000 + Math.random() * 900000).toString();
//     otpStore.set(email, otp);

//     // send email via nodemailer
//      const transporter = nodemailer.createTransport({
//         service: "gmail",
//         auth: {
//             user: process.env.EMAIL,
//             pass: process.env.EMAIL_PASS,
//         }
//      })

//      const mailOptions = {
//          from: process.env.EMAIL,
//          to: email,
//          subject: "Your otp for Ticket Dashboard Login",
//          text: `Your otp is ${otp}`,
//      }

//      try {
//          transporter.sendMail(mailOptions);
//           return res
//           .status(201)
//           .json(new ApiResponse(201, mailOptions, "Otp sent successfully"))
   
//      } catch (error) {
//          console.log("Error while sending email:", error);
//          throw new ApiError(500, "failed to send otp")
//      }
// })

// // verify otp and login

// const verifyOtp = asyncHandler(async (req, res) => {
//        const {email, otp} = req.body;

//        const storedOtp = otpStore.get(email);
//        console.log("stored otp is:", storedOtp)
//         if(!storedOtp || storedOtp != otp){
//              throw new ApiError(400, "Invalid Otp",)
//         }

//         // lets remove otp after use
//         otpStore.delete(email);

//         // find or create user

//         let user = await User.findOne({email});

//          console.log("user is:", user)
//          if(!user){
//              user = await User.create({email});
//          }

//         //  generate jwt
//          const token = jwt.sign(
//             {email}, 
//           process.env.JWT_SECRET,
//           {expiresIn: "1d"}
//          )

//          return res
//          .status(201)
//          .json(new ApiResponse(201, {token, user}, "Login Successful"))



// })

// export {
//      sendOtp,
//      verifyOtp,
// }


import {User} from "../models/user.model.js"
import jwt from "jsonwebtoken"
import nodemailer from "nodemailer"
import {asyncHandler} from "../utils/asyncHandler.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import dotenv from "dotenv"
dotenv.config();

const otpStore = new Map(); // key-value pairs  > email : otp

// const sendOtp = asyncHandler(async (req, res) => {
      
//     const {email} = req.body;
//     console.log("email is:", email)
     
//     if(!email){
//          throw new ApiError(400, "email is required")
//     }

//     const otp = Math.floor(100000 + Math.random() * 900000).toString();
//     console.log("stored otp is:", otp);
//     otpStore.set(email, otp);

//     // Configure transporter with proper settings for Render
//     const transporter = nodemailer.createTransport({
//         host: "smtp.gmail.com",
//         port: 587,  // Use port 587 instead of 465
//         secure: false, // true for 465, false for other ports
//         auth: {
//             user: process.env.EMAIL,
//             pass: process.env.EMAIL_PASS, // MUST be App Password, not regular password
//         },
//         tls: {
//             rejectUnauthorized: false
//         },
//         connectionTimeout: 10000, // 10 seconds
//         greetingTimeout: 10000,   // 10 seconds
//         socketTimeout: 10000      // 10 seconds
//     });

//     const mailOptions = {
//         from: process.env.EMAIL,
//         to: email,
//         subject: "Your OTP for Ticket Dashboard Login",
//         html: `
//             <div style="font-family: Arial, sans-serif; padding: 20px;">
//                 <h2>Ticket Dashboard Login</h2>
//                 <p>Your One-Time Password (OTP) is:</p>
//                 <h1 style="color: #4F46E5; font-size: 32px; letter-spacing: 3px;">${otp}</h1>
//                 <p>This code will expire in 10 minutes.</p>
//                 <p style="color: #666; font-size: 12px;">If you didn't request this, please ignore this email.</p>
//             </div>
//         `
//     };

//     try {
//         // Verify connection first
//         await transporter.verify();
//         console.log("SMTP connection verified");
        
//         // Send email
//         const info = await transporter.sendMail(mailOptions);
//         console.log("Email sent successfully:", info.messageId);
        
//         return res
//             .status(201)
//             .json(new ApiResponse(201, { email }, "OTP sent successfully"));
   
//     } catch (error) {
//         console.error("Error while sending email:", error);
//         console.error("Error code:", error.code);
//         console.error("Error command:", error.command);
//         throw new ApiError(500, "Failed to send OTP: " + error.message);
//     }
// });

// verify otp and login

const sendOtp = asyncHandler(async (req, res) => {
      
    const {email} = req.body;
    console.log("email is:", email)
     
    if(!email){
         throw new ApiError(400, "email is required")
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    console.log("stored otp is:", otp);
    otpStore.set(email, otp);

    // Brevo SMTP Configuration
    const transporter = nodemailer.createTransport({
        host: "smtp-relay.brevo.com",
        port: 587,
        secure: false,
        auth: {
            user: process.env.BREVO_SMTP_USER,  // Your Brevo login email
            pass: process.env.BREVO_SMTP_KEY    // Your SMTP key
        }
    });

    const mailOptions = {
        from: '"Ticket Dashboard" <sahilabcd7834@gmail.com>',
        to: email,
        subject: "Your OTP for Ticket Dashboard Login",
        html: `
            <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px;">
                <h2 style="color: #333;">Ticket Dashboard Login</h2>
                <p>Your One-Time Password (OTP) is:</p>
                <h1 style="color: #4F46E5; font-size: 36px; letter-spacing: 4px; margin: 20px 0;">${otp}</h1>
                <p style="color: #666;">This code will expire in 10 minutes.</p>
                <p style="color: #999; font-size: 12px; margin-top: 30px;">If you didn't request this code, please ignore this email.</p>
            </div>
        `
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log(" Email sent successfully via Brevo:", info.messageId);
        
        return res
            .status(201)
            .json(new ApiResponse(201, { email }, "OTP sent successfully"));
   
    } catch (error) {
        console.error("Error while sending email:", error);
        throw new ApiError(500, "Failed to send OTP: " + error.message);
    }
});


const verifyOtp = asyncHandler(async (req, res) => {
    const {email, otp} = req.body;

    const storedOtp = otpStore.get(email);
    console.log("stored otp is:", storedOtp);
    
    if(!storedOtp || storedOtp != otp){
        throw new ApiError(400, "Invalid OTP");
    }

    // lets remove otp after use
    otpStore.delete(email);

    // find or create user
    let user = await User.findOne({email});

    console.log("user is:", user);
    if(!user){
        user = await User.create({email});
    }

    // generate jwt
    const token = jwt.sign(
        {email}, 
        process.env.JWT_SECRET,
        {expiresIn: "1d"}
    );

    return res
        .status(201)
        .json(new ApiResponse(201, {token, user}, "Login Successful"));
});

export {
    sendOtp,
    verifyOtp,
}