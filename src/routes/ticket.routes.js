import { Router } from "express";
import {createTicket, getTicketsByProject, updateTicketStatus} from "../controllers/ticket.controller.js"
const router = Router();



router.route("/create").post(createTicket)
router.route("/project/:projectId").get(getTicketsByProject);
router.route("/update-status").put(updateTicketStatus);

export default router;