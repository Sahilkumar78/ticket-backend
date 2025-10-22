import { Project } from "../models/project.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";


const createProject = asyncHandler(async (req, res) => {
       
      const {name, description, createdBy} = req.body;

    try {
          const project = await Project.create({name, description, createdBy, members: [createdBy]});
            return res
            .status(201)
            .json(new ApiResponse(201, project, "Project created Successfully"))
    
    } catch (error) {
         console.log("Error while creating project", error);
         throw new ApiError(500, error?.message || "Error while creating project")
    }

})


//  get all projects of user
const getUserProjects = asyncHandler(async (req, res) => {
      const {email} = req.params;
 
       try {
          const projects = await Project.find({members: email})

          console.log("projects are:", projects)

           return res
           .status(201)
           .json(new ApiResponse(201, projects, "Projects got successfully"))
       
       } catch (error) {
           console.log("Error while getting user:", error?.message)
           throw new ApiError(500, error?.message)
       } 
})

    //    add member

    const addMember = asyncHandler(async (req, res) => {
          const {projectId, email} = req.body;

         try {
             const project = await Project.findById(projectId);
             if(!project){
                throw new ApiError(404, "Project not found")
             }
   
             if(!project.members.includes(email)){
                 project.members.push(email);
                 await project.save();
             }
   
             return res
             .status(201)
             .json(new ApiResponse(201, project, "Member added successfully"));
   
         } catch (error) {
             console.log("Error while adding member is:", error?.message);
             throw new ApiError(500, error?.message)
         }

    })

export {
     createProject,
     getUserProjects,
     addMember,
}