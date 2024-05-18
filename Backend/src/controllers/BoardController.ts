import {Request, Response} from "express";
import Board from "../models/boards";
import mongoose from "mongoose";
import List from "../models/list";
import Card from "../models/cards";

const createBoard = async (req: Request, res: Response) => {
  try {
    console.log("request body === ", req.body);
    const board = new Board(req.body);
    board.user = new mongoose.Types.ObjectId(req.userId);
    board.createdAt = new Date();

    await board.save();
    res.status(201).send(board);
  } catch (error) {
    console.log("Error at Board Controller - create board", error);
    res.status(500).json({message: "Something Went wrong"});
  }
};

const getAllBoards = async (req: Request, res: Response) => {
  try {
    const boards = await Board.find({user: req.userId});
    res.status(200).send(boards);
  } catch (error) {
    console.log("Error at Board Controller - get all boards", error);
    res.status(500).json({message: "Something went wrong"});
  }
};

const getBoardById = async (req: Request, res: Response) => {
  try {
    const board = await Board.findById(req.params.boardId).populate("lists");
    if (!board) {
      return res.status(404).json({message: "Board not found"});
    }
    res.status(200).json(board);
  } catch (error) {
    console.error("Error at Board Controller - get board by ID", error);
    res.status(500).json({message: "Something went wrong"});
  }
};

const deleteBoard = async (req: Request, res: Response) => {
  try {
    const {boardId} = req.params;

    // Find all lists associated with the board
    const lists = await List.find({board: boardId});

    // Delete all cards associated with each list
    for (const list of lists) {
      await Card.deleteMany({list: list._id});
    }

    // Delete all lists associated with the board
    await List.deleteMany({board: boardId});

    // Delete the board
    const board = await Board.findByIdAndDelete(boardId);

    if (!board) {
      return res.status(404).json({message: "Board not found"});
    }

    res.status(200).json({
      message: "Board, lists, and associated cards deleted successfully",
    });
  } catch (error) {
    console.log("Error at deleteBoard:", error);
    res.status(500).json({message: "Something went wrong"});
  }
};

export default {
  createBoard,
  getAllBoards,
  getBoardById,
  deleteBoard,
};
