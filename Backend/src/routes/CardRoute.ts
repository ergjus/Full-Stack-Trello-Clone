import express from "express";
import CardController from "../controllers/CardController";
import {jwtCheck, jwtParse} from "../middleware/auth";

const router = express.Router();

// TODO: create middleware validation for card
// Creates new card
router.post("/", jwtCheck, jwtParse, CardController.createCard);

// Get card by list id
router.get("/list/:listId", jwtCheck, jwtParse, CardController.getCardByList);

// its supposed to update the cards position
router.put(
  "/:cardId/position",
  jwtCheck,
  jwtParse,
  CardController.updateCardPosition
);

// deletes card
router.delete("/:cardId", jwtCheck, jwtParse, CardController.deleteCard);

export default router;
