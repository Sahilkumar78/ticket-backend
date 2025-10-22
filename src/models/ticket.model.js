import mongoose from "mongoose"

const ticketSchema = new mongoose.Schema({
       projectId:{
          type: mongoose.Schema.Types.ObjectId,
          ref: "Project",
          required: true
       },

       title:{
        type: String,
        required: true
       },

       description:{
         type: String
       },
     
       status:{
          type: String,
          enum: ["todo", "in-progress", "done"],
          default: "todo"
       },

       createdAt: { 
           type: String,
           required: true
       },

       updatedBy:{
          type: String
       },

       updatedAt:{
         type: Date,
         default: Date.now
       }
})


export const Ticket = mongoose.model("Ticket", ticketSchema);