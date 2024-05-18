import {Request, Response} from "express";
import List from "../models/list";
import Card from "../models/cards";

const createCard = async (req: Request, res: Response) => {
  try {
    const {cardTitle, listId, description} = req.body;

    // Verifying the list exists
    const list = await List.findById(listId);
    if (!list) {
      return res.status(404).json({message: "Card Ctrl - List not found!"});
    }

    // Get the current number of cards to set the position for the new card
    const cardCount = await Card.countDocuments({list: listId});
    const position = cardCount;

    const card = new Card({
      cardTitle,
      list: listId,
      description,
      position,
    });

    await card.save();

    res.status(201).send(card);
  } catch (error) {
    console.log("ERROR @ createCard::", error);
    res.status(500).json({message: "Something went wrong at Card Controller"});
  }
};

const getCardByList = async (req: Request, res: Response) => {
  try {
    const {listId} = req.params;
    const cards = await Card.find({list: listId}).sort({position: 1});

    res.status(200).send(cards);
  } catch (error) {
    console.log("ERROR @ get card by list::", error);
    res.status(500).json({message: "Something went wrong at Card Ctrl"});
  }
};

const deleteCard = async (req: Request, res: Response) => {
  try {
    const {cardId} = req.params;
    const card = await Card.findByIdAndDelete(cardId);

    if (!card) {
      return res.status(404).json({message: "Card not found in delete ctrl"});
    }

    res.status(200).json({message: "Card deleted successfully"});
  } catch (error) {
    console.log("Error at delete card::", error);
    res.status(500).json({message: "Something went wrong"});
  }
};

const updateCardPosition = async (req: Request, res: Response) => {
  try {
    const {cardId} = req.params;
    const {listId, position} = req.body;

    const card = await Card.findById(cardId);
    if (!card) {
      return res.status(404).json({message: "Card not found"});
    }

    const cards = await Card.find({list: listId}).sort({position: 1});

    // Reorder cards
    cards.splice(card.position, 1);
    cards.splice(position, 0, card);

    // Update positions
    for (let i = 0; i < cards.length; i++) {
      cards[i].position = i;
      await cards[i].save();
    }

    res.status(200).json(card);
  } catch (error) {
    console.log("Error at update card position::", error);
    res.status(500).json({message: "Something went wrong"});
  }
};

export default {
  createCard,
  getCardByList,
  updateCardPosition,
  deleteCard,
};
