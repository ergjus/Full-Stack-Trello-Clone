import mongoose from "mongoose";

const listSchema = new mongoose.Schema({
  listTitle: {type: String, required: true},
  board: {type: mongoose.Schema.Types.ObjectId, ref: "Board", required: true}, // Reference to Board
  cards: [{type: mongoose.Schema.Types.ObjectId, ref: "Card"}], // Reference to Cards
  position: {type: Number, required: true},
  createdAt: {type: Date, default: Date.now},
});

const List = mongoose.model("List", listSchema);
export default List;
