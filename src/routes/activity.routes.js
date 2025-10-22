import { Router } from "express"
import {getProjectActivities} from "../controllers/activity.controller.js"


const router = Router();

router.route("/project/:projectId").get(getProjectActivities)

export default router;

