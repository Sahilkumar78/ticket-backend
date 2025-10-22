import { Ticket } from "../models/ticket.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {Activity} from "../models/activity.model.js"

const createTicket = asyncHandler(async (req, res) => {
      const {projectId, title, description, createdBy} = req.body;

  try {
     const ticket = await Ticket.create({projectId, title, description, createdBy, createdAt: Date.now()});
       
     //log activity
      await Activity.create({
          projectId,
          ticketId: ticket._id,
          userEmail: createdBy,
          message: `Created a new ticket: ${title}`,
      })
  
      return res
      .status(201)
      .json(new ApiResponse(201, ticket, "Ticket created successfully"))
  
  } catch (error) {
      console.log("Error while creating ticket: ", error?.message);
       throw new ApiError(500, error?.message);
  }
})


//   get tickets by project
 const getTicketsByProject = asyncHandler(async (req, res) => {
      
     const {projectId} = req.params;
     
     try {

       const tickets = await Ticket.find({projectId});
        return res
        .status(201)
        .json(new ApiResponse(200, tickets, "Got tickets by project id"));
        
     } catch (error) {
         console.log("Error while getting tickets by projects:", error)
         throw new ApiError(500, error?.message);
     }
 })

    //  update ticket status
    const updateTicketStatus = asyncHandler(async (req, res) => {
          
        const {ticketId, newStatus, updatedBy} = req.body;
        console.log("ticket id is:", ticketId);
        console.log("newStatus is:", newStatus)

        try {
            
           const ticket = await Ticket.findById(ticketId);

           if(!ticket){
              throw new ApiError(404, "Ticket not found")
           }

           ticket.status = newStatus;
           ticket.updatedBy = updatedBy;
           ticket.updatedAt = Date.now();

           await ticket.save();

           await Activity.create({
            projectId: ticket.projectId,
            ticketId,
            userEmail: updatedBy,
            message: `Moved ticket "${ticket.title} to ${newStatus}`,
           })
          
           return res
           .status(201)
           .json(new ApiResponse(201, ticket, "Status updated successfully"))

        } catch (error) {
            console.log("error while updating tickets:", error);
            throw new ApiError(500, error?.message);
        }
    })


export {
     createTicket,
     getTicketsByProject,
     updateTicketStatus,
}