import { Router } from "express";
import { authOptional, authRequired } from "../middlewares/auth.js";
import * as ctrl from "../controllers/notification.controller.js";

import { asyncHandler } from "../middlewares/asyncHandler.js";

const router = Router();

router.post("/", asyncHandler(ctrl.create));
router.get("/", authOptional, asyncHandler(ctrl.list));
router.patch("/:id/read", authRequired, asyncHandler(ctrl.readOne));
router.patch("/read-all", authOptional, asyncHandler(ctrl.readAll));
router.delete("/:id", authRequired, asyncHandler(ctrl.remove));

export default router;
