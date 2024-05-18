import {useAuth0} from "@auth0/auth0-react";
import {Button} from "./ui/button";
import UsernameMenu from "./UsernameMenu";

const MainNav = () => {
  const {loginWithRedirect, isAuthenticated} = useAuth0();
  return (
    <span className="flex space-x-2 items-center">
      {isAuthenticated ? (
        <UsernameMenu />
      ) : (
        <Button
          className="text-white font-bold bg-blue-500 hover:bg-blue-700"
          onClick={async () => await loginWithRedirect()}>
          Log In
        </Button>
      )}
    </span>
  );
};

export default MainNav;
