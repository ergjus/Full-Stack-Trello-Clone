import {Link} from "react-router-dom";
import {Button} from "./ui/button";
import {useAuth0} from "@auth0/auth0-react";
import CreateBoardDialog from "./board/CreateBoard";
import {useCreateBoard} from "@/api/BoardApi";

const MobileNavLinks = () => {
  const {logout} = useAuth0();
  const {createBoard, isLoading} = useCreateBoard();
  return (
    <>
      <Link
        to="/user-profile"
        className="flex bg-white items-center font-bold hover:text-blue-500">
        User Profile
      </Link>
      <CreateBoardDialog
        onSave={createBoard}
        isLoading={isLoading}></CreateBoardDialog>
      <Button
        className="flex items-center px-3 font-bold bg-blue-500 hover:bg-gray-500"
        onClick={() => logout()}>
        Log Out
      </Button>
    </>
  );
};

export default MobileNavLinks;
