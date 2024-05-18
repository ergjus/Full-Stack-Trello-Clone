import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {List, Card as CardType} from "@/types";
import CardComponent from "@/components/card/CardComponent";
import CreateCard from "../card/CreateCard";
import {useGetCardsByList} from "@/api/CardApi";
import {LoadingSpinner} from "../LoadingSpinner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {useDeleteList} from "@/api/ListApi";
import {Button} from "../ui/button";
import {Trash} from "lucide-react";

type ListCardProps = {
  onCardCreated: () => void;
  list: List;
};

const ListCard: React.FC<ListCardProps> = ({list, onCardCreated}) => {
  const {cards, isLoading, error, refetch} = useGetCardsByList(list._id);

  const {deleteList} = useDeleteList(() => {
    console.log("Card deleted!");
  });

  const handleCardCreated = () => {
    refetch(); // Refetch the cards after a new card is created
    onCardCreated();
  };

  const handleDelete = async () => {
    await deleteList(list._id);
  };

  return (
    <Card className="bg-blue-500">
      <CardHeader>
        <CardTitle className="text-white">
          <div className="flex justify-between items-center">
            <div>
              <h1>{list.listTitle}</h1>
            </div>

            <div>
              <AlertDialog>
                <AlertDialogTrigger>
                  <Button variant="ghost" className="text-white-500">
                    <Trash size={20} strokeWidth={2.5}></Trash>
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This action will permanently
                      delete '
                      <span className="font-bold text-blue-500">
                        {list.listTitle}
                      </span>
                      ' and all the cards inside.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDelete}
                      className="bg-blue-500">
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="text-slate-50">
        {isLoading ? (
          <LoadingSpinner size={30} />
        ) : error ? (
          <div>Error: {error.message}</div>
        ) : (
          <div className="space-y-4">
            {cards?.map((card: CardType) => (
              <CardComponent key={card._id} card={card} listId={list._id} />
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex align-center justify-center">
        <CreateCard listId={list._id} onCardCreated={handleCardCreated} />
      </CardFooter>
    </Card>
  );
};

export default ListCard;
