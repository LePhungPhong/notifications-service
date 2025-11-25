import { Router } from "express";
import * as ctrl from "../controllers/notification.controller.js";

import { asyncHandler } from "../middlewares/asyncHandler.js";
import { verifyToken } from "../middlewares/jwt.js";

const router = Router();

router.use(verifyToken);

router.post("/", asyncHandler(ctrl.create));
router.get("/", asyncHandler(ctrl.list));
router.patch("/:id/read", asyncHandler(ctrl.readOne));
router.patch("/read-all", asyncHandler(ctrl.readAll));
router.delete("/:id", asyncHandler(ctrl.remove));

export default router;
