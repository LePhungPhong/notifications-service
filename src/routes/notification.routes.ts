import { Router } from "express";
import { authOptional, authRequired } from "../middlewares/auth.js";
import * as ctrl from "../controllers/notification.controller.js";

const router = Router();

router.post("/", ctrl.create);
router.get("/", authOptional, ctrl.list);
router.patch("/:id/read", authRequired, ctrl.readOne);
router.patch("/read-all", authOptional, ctrl.readAll);
router.delete("/:id", authRequired, ctrl.remove);

export default router;
