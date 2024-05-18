import mongoose from "mongoose";

const boardSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  boardName: {type: String, required: true},
  boardDescription: {type: String},
  createdAt: {type: Date, default: Date.now},
  lastUpdated: {type: Date},
  lists: [{type: mongoose.Schema.Types.ObjectId, ref: "List"}],
});

const Board = mongoose.model("Board", boardSchema);
export default Board;
