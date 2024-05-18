import {useGetAllBoards} from "@/api/BoardApi";
import {LoadingSpinner} from "@/components/LoadingSpinner";
import BoardCard from "@/components/board/BoardCard";
import {Board} from "@/types";
import {useAuth0} from "@auth0/auth0-react";

const HomePage = () => {
  const {isAuthenticated} = useAuth0();
  const {getBoards, isLoading} = useGetAllBoards();

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen mx-auto">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-blue-600">
            Welcome to <span className="text-blue-300">Vito</span>.
          </h1>
          <h2 className="mt-4 text-3xl font-semibold text-blue-400">
            Log in to see your boards.
          </h2>
        </div>
      </div>
    );
  }

  if (isLoading) {
    <div className="flex items-center justify-center">
      <LoadingSpinner size={100} />
    </div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Your Boards</h1>
      </div>
      <div>
        {getBoards && getBoards.length === 0 ? (
          <p>No boards available. Create a new board to get started!</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {getBoards?.map((board: Board) => (
              <BoardCard key={board._id} board={board} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
