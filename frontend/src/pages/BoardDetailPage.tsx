import React from "react";
import {Link, useParams} from "react-router-dom";
import {List} from "@/types";
import {LoadingSpinner} from "@/components/LoadingSpinner";
import CreateList from "@/components/list/CreateList";
import {useGetListsByBoard} from "@/api/ListApi";
import {useGetBoard} from "@/api/BoardApi";
import ListCard from "@/components/list/ListCard";
import {SquareArrowLeft} from "lucide-react";
import {Button} from "@/components/ui/button";

const BoardDetailPage: React.FC = () => {
  const {boardId} = useParams<{boardId: string}>();
  const {
    board,
    isLoading: isLoadingBoard,
    error: errorBoard,
  } = useGetBoard(boardId!);
  const {
    lists,
    isLoading: isLoadingLists,
    error: errorLists,
    refetch,
  } = useGetListsByBoard(boardId!);

  const handleListCreated = () => {
    refetch(); // Refetch the lists after a new list is created
  };

  const handleCardCreated = () => {
    refetch();
  };

  if (isLoadingBoard) return <LoadingSpinner size={100} />;

  if (errorBoard) {
    return <div>Error: {errorBoard.message}</div>;
  }

  if (!board) {
    return <div>Board not found</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <Link to={"/"}>
        <Button
          variant="ghost"
          className="hover:bg-transparent text-blue-500 hover:text-blue-700 py-5">
          <SquareArrowLeft strokeWidth={2.5} size={30}></SquareArrowLeft>
        </Button>
      </Link>

      <h1 className="text-4xl font-bold mb-4">{board.boardName}</h1>
      <p className="mb-4">{board.boardDescription}</p>
      {isLoadingLists ? (
        <div className="flex items-center justify-center h-screen">
          <LoadingSpinner size={50} />
        </div>
      ) : errorLists ? (
        <div>Error: {errorLists.message}</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {lists?.map((list: List) => (
            <div>
              <ListCard
                key={list._id}
                list={list}
                onCardCreated={handleCardCreated}></ListCard>
            </div>
          ))}

          <div className="flex justfiy-center item-center place-content-center">
            <CreateList boardId={boardId!} onListCreated={handleListCreated} />
          </div>
        </div>
      )}
    </div>
  );
};

export default BoardDetailPage;
