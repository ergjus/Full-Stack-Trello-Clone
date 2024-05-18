import mongoose from "mongoose";

const cardSchema = new mongoose.Schema({
  cardTitle: {type: String, required: true},
  description: {type: String},
  list: {type: mongoose.Schema.Types.ObjectId, ref: "List", required: true}, // Reference to List
  position: {type: Number, required: true},
  createdAt: {type: Date, default: Date.now},
});

const Card = mongoose.model("Card", cardSchema);
export default Card;
