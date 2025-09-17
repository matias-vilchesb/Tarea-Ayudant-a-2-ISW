import { Router } from "express";
import express from "express";
import { authMiddleware} from "../middleware/auth.middleware.js";
import { updateProfile, deleteProfile, getPublicProfile,
  getPrivateProfile, } from "../controllers/profile.controller.js"
const router = express.Router();

// Ruta para actualizar el perfil
router.patch("/private", authMiddleware, updateProfile);

// Ruta para borrar el perfil 
router.delete("/private", authMiddleware, deleteProfile);
// Ruta para obtener el perfil público

router.get("/public", getPublicProfile);

router.get("/private", authMiddleware, getPrivateProfile);

export default router;
