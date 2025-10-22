import { Router } from "express";
import { verifyAdmin } from "../controllers/admin.controller.js";

const router = Router();
 
router.route("/verify-admin").post(verifyAdmin)

export default  router