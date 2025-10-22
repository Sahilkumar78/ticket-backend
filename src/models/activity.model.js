import mongoose from "mongoose";

const activitySchema = new mongoose.Schema({
     projectId: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Project"
     },

     ticketId:{
          type: mongoose.Schema.Types.ObjectId,
          ref: "Ticket"
     },

     userEmail:{
           type: String
     },

     message:{
         type: String
     },

     createdAt: {
        type: Date,
        default: Date.now
     } 
})

export const Activity = mongoose.model("Activity", activitySchema)