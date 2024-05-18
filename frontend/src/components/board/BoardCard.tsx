import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Board} from "@/types";
import {Link, useNavigate} from "react-router-dom";
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
import {Button} from "../ui/button";
import {Trash} from "lucide-react";
import {useDeleteBoard} from "@/api/BoardApi";

type BoardCardProps = {
  board: Board;
};

const BoardCard: React.FC<BoardCardProps> = ({board}) => {
  const navigate = useNavigate();

  const {deleteBoard} = useDeleteBoard(() => {
    navigate("/");
  });

  const handleDelete = async (event: React.MouseEvent) => {
    event.stopPropagation();
    await deleteBoard(board._id);
  };

  return (
    <Card className="bg-blue-600 hover:shadow-md transition-transform transform hover:-translate-y-1 hover:shadow-lg">
      <CardHeader>
        <CardTitle className="text-white">
          <div className="flex justify-between items-center">
            <div>
              <h1>{board.boardName}</h1>
            </div>
            <div>
              <AlertDialog>
                <AlertDialogTrigger asChild>
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
                        {board.boardName}
                      </span>
                      ' including all of the lists and cards inside this board.
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
      <Link to={`/boards/${board._id}`}>
        <CardContent className="text-slate-50">
          {board.boardDescription ? (
            <p>{board.boardDescription}</p>
          ) : (
            <p>Add a description to provide more context for this board.</p>
          )}
        </CardContent>
      </Link>
    </Card>
  );
};

export default BoardCard;
