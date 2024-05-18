import {CircleUserRound} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "./ui/dropdown-menu";
import {useAuth0} from "@auth0/auth0-react";
import {Link} from "react-router-dom";
import {Separator} from "./ui/separator";
import {Button} from "./ui/button";

const UsernameMenu = () => {
  const {user, logout} = useAuth0();
  console.log("user", user);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center px-3 font-bold hover:text-blue-500 gap-2">
        <CircleUserRound className="text-blue-500"> </CircleUserRound>
        {user?.email}
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>
          <Link to="/user-profile" className="font-bold hover:text-blue-500">
            User Profile
          </Link>
        </DropdownMenuItem>
        <Separator></Separator>
        <DropdownMenuItem>
          <Button
            className="flex flex-1 font-bold bg-blue-500"
            onClick={() => logout()}>
            Log Out
          </Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UsernameMenu;
