import express from "express";
import ListController from "../controllers/ListController";
import {jwtCheck, jwtParse} from "../middleware/auth";

const router = express.Router();

// Route to create a new list
// TODO: need to create validation middleware for lists
router.post("/", jwtCheck, jwtParse, ListController.createList);

// Route to get all lists by board
router.get(
  "/board/:boardId",
  jwtCheck,
  jwtParse,
  ListController.getListsByBoard
);

router.put(
  "/:listId/position",
  jwtCheck,
  jwtParse,
  ListController.updateListPosition
);

router.delete("/:listId", jwtCheck, jwtParse, ListController.deleteList);

export default router;
