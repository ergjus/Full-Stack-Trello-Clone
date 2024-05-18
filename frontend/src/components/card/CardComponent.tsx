import React from "react";
import {Card as CardType} from "@/types";
import {Card, CardContent, CardHeader, CardTitle} from "../ui/card";
import {Button} from "../ui/button";
import {useDeleteCard} from "@/api/CardApi";
import {Trash} from "lucide-react";

type CardProps = {
  card: CardType;
  listId: string;
};

const CardComponent: React.FC<CardProps> = ({card}) => {
  const {deleteCard} = useDeleteCard(() => {
    console.log("Card deleted!");
  });

  const handleDelete = async () => {
    await deleteCard(card._id);
  };

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>
            <div className="flex justify-between items-center">
              {card.cardTitle}
              <Button
                onClick={handleDelete}
                variant="ghost"
                className="text-blue-500">
                <Trash size={20} strokeWidth={2.5}></Trash>
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p>{card.description}</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default CardComponent;
