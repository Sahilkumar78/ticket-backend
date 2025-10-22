import { Router } from "express";
import { addMember, createProject, getUserProjects } from "../controllers/project.controller.js";


const router = Router();

router.route("/create").post(createProject)
router.route("/auth/:email").get(getUserProjects)
router.route("/add-member").post(addMember)


export default router;