import mongoose from "mongoose"

const projectSchema = new mongoose.Schema({
     name: {
        type: String,
        required: true
     },

     description:{
         type: String
     },

     createdBy: {
          type: String,
           required: true
     },

     members: [{type: String}], // store emails of members

     createdAt: {
        type:Date, 
        default: Date.now
     }

    
})


export const Project = mongoose.model("Project", projectSchema)