import { Router } from "express";
import absensiController from "../controllers/absensi.controller";
import { authenticateToken } from "../middlewares/auth.middleware";

const absensiRouter = Router();

absensiRouter.post("/", authenticateToken, absensiController.create);
absensiRouter.get("/", authenticateToken, absensiController.getDetail);
absensiRouter.put("/:id", authenticateToken, absensiController.update);
absensiRouter.delete("/:id", authenticateToken, absensiController.remove);

export default absensiRouter;
