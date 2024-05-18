import {Link} from "react-router-dom";
import MobileNav from "./MobileNav";
import MainNav from "./MainNav";
import {useCreateBoard} from "@/api/BoardApi";
import CreateBoardDialog from "./board/CreateBoard";
import {useAuth0} from "@auth0/auth0-react";

const Header = () => {
  const {createBoard, isLoading} = useCreateBoard();
  const {isAuthenticated} = useAuth0();

  return (
    <div className="border-b-2 border-b-blue-200 py-6">
      <div className="container mx-auto flex justify-between items-center">
        <Link
          to="/"
          className="text-3xl font-bold tracking-tight text-blue-500">
          Vito
        </Link>
        <div className="md:hidden">
          <MobileNav />
        </div>
        <div className="hidden md:flex space-x-4">
          {isAuthenticated ? (
            <CreateBoardDialog
              onSave={createBoard}
              isLoading={isLoading}></CreateBoardDialog>
          ) : (
            <span></span>
          )}

          <MainNav></MainNav>
        </div>
      </div>
    </div>
  );
};

export default Header;
