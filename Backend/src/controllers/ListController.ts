import {Request, Response} from "express";
import List from "../models/list";
import Board from "../models/boards";
import Card from "../models/cards";

const createList = async (req: Request, res: Response) => {
  try {
    const {listTitle, boardId} = req.body;
    console.log("createList api::", req.body);
    // Verify board exists
    const board = await Board.findById(boardId);
    if (!board) {
      return res.status(404).json({message: "Board not found"});
    }

    // Get the current number of lists to set the position for the new list
    const listCount = await List.countDocuments({board: boardId});
    const position = listCount;

    const list = new List({
      listTitle,
      board: boardId,
      position,
    });

    await list.save();

    board.lists.push(list._id);
    await board.save();

    res.status(201).send(list);
  } catch (error) {
    console.error("Error at List Controller - create list", error);
    res.status(500).json({message: "Something went wrong"});
  }
};

const getListsByBoard = async (req: Request, res: Response) => {
  try {
    const {boardId} = req.params;
    console.log("get list by board::: " + boardId);

    const lists = await List.find({board: boardId});
    console.log("get list by lists returned::: " + lists);

    res.status(200).send(lists);
  } catch (error) {
    console.error("Error at List Controller - get lists by board", error);
    res.status(500).json({message: "Something went wrong"});
  }
};

const updateListPosition = async (req: Request, res: Response) => {
  try {
    const {listId} = req.params;
    const {position} = req.body;

    const list = await List.findByIdAndUpdate(listId, {position}, {new: true});
    if (!list) {
      return res.status(404).json({message: "List not found"});
    }

    res.status(200).json(list);
  } catch (error) {
    console.error("Error updating list position::", error);
    res.status(500).json({message: "Something went wrong"});
  }
};

const deleteList = async (req: Request, res: Response) => {
  try {
    const {listId} = req.params;

    await Card.deleteMany({list: listId});

    const list = await List.findByIdAndDelete(listId);

    if (!list) {
      return res.status(404).json({message: "list not found at delete list"});
    }

    res
      .status(200)
      .json({message: "List and associated cards deleted successfully"});
  } catch (error) {
    console.log("Error at delete list::", error);
    res.status(500).json({message: "Something went wrong"});
  }
};

export default {
  createList,
  getListsByBoard,
  updateListPosition,
  deleteList,
};
