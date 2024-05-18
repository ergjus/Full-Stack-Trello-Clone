import express from "express";
import BoardController from "../controllers/BoardController";
import {jwtCheck, jwtParse} from "../middleware/auth";
import {validateBoardRequest} from "../middleware/validation";

const router = express.Router();

router.post(
  "/",
  validateBoardRequest,
  jwtCheck,
  jwtParse,
  BoardController.createBoard
);

router.get("/", jwtCheck, jwtParse, BoardController.getAllBoards);

router.get("/:boardId", jwtCheck, jwtParse, BoardController.getBoardById);

router.delete("/:boardId", jwtCheck, jwtParse, BoardController.deleteBoard);

export default router;
