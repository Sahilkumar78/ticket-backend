import dotenv from "dotenv"
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
 dotenv.config();


 const verifyAdmin =  asyncHandler(async (req, res) => {
   
   try {
          const {password} = req.body;   
          console.log("password is:", password)
          if(!password)  throw new ApiError(400, "password required")

        //  compare with admin password stored in .env
        if(password === process.env.ADMIN_PASSWORD){
              return res
              .status(201)
              .json(new ApiResponse(201, "Access granted"))
        }else{
            return res
            .status(401)
            .json(new ApiResponse(401, "Invalid Password")) 
        }

      } catch (error) {
          console.log("Error while verify admin:", error)
          throw new ApiError(500, "Server error")
      }

 })

 export {verifyAdmin}