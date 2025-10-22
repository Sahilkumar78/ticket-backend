

//   get recent activities by project

import { Activity } from "../models/activity.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getProjectActivities = asyncHandler(async (req, res) => {
       const {projectId} = req.params;

       try {

        const activities = await Activity.find({projectId})
        .sort({createdAt: -1})
        .limit(20);

        console.log("Activities are :", activities);

        return res
        .status(201)
        .json(new ApiResponse(201, activities, "Successfully got project activities"));
        
       } catch (error) {
        console.log("Error while getting projects activities: ", error);
        throw new ApiError(500, error?.message);
       }
})

export {getProjectActivities};