export type User = {
  _id: string;
  email: string;
  name: string;
  addressLine1: string;
  city: string;
  country: string;
};

export type Board = {
  _id: string;
  boardName: string;
  boardDescription?: string;
  createdAt: string;
  lastUpdated?: string;
  lists: string[];
};

export type List = {
  _id: string;
  listTitle: string;
  board: string;
  cards: string[];
  createdAt: string;
  updatedAt: string;
};

export type Card = {
  _id: string;
  cardTitle: string;
  description?: string;
  list: string;
  position: number;
  createdAt?: string;
};
