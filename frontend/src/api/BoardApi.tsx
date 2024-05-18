import {Board} from "@/types";
import {useAuth0} from "@auth0/auth0-react";
import {useMutation, useQuery, useQueryClient} from "react-query";
import {toast} from "sonner";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

type CreateBoardRequest = {
  boardName: string;
  boardDescription?: string;
};

export const useCreateBoard = () => {
  const {getAccessTokenSilently} = useAuth0();

  const createMyBoardRequest = async (board: CreateBoardRequest) => {
    const accessToken = await getAccessTokenSilently();
    const response = await fetch(`${API_BASE_URL}/api/my/board`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(board),
    });

    if (!response.ok) {
      throw new Error("Failed to create user");
    }

    return response.json(); // Return the created board data
  };

  const {
    mutateAsync: createBoard,
    isLoading,
    error,
  } = useMutation(createMyBoardRequest, {
    onSuccess: (data) => {
      toast.success("Board created!");
      return data; // Return the created board data on success
    },
  });

  if (error) {
    toast.error(error.toString());
  }

  return {
    createBoard,
    isLoading,
  };
};

export const useGetAllBoards = () => {
  const {getAccessTokenSilently} = useAuth0();

  const fetchBoards = async (): Promise<Board[]> => {
    const accessToken = await getAccessTokenSilently();

    const response = await fetch(`${API_BASE_URL}/api/my/board`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch boards");
    }
    return response.json();
  };

  const {data, isLoading, error} = useQuery<Board[], Error>(
    "boards",
    fetchBoards
  );

  if (error) {
    toast.error(error.message);
  }

  return {getBoards: data, isLoading};
};

export const useGetBoard = (boardId: string) => {
  const {getAccessTokenSilently} = useAuth0();

  const fetchBoard = async (): Promise<Board> => {
    const accessToken = await getAccessTokenSilently();

    const response = await fetch(`${API_BASE_URL}/api/my/board/${boardId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch board");
    }
    return response.json();
  };

  const {data, isLoading, error} = useQuery<Board, Error>(
    ["board", boardId],
    () => fetchBoard(),
    {
      enabled: !!boardId,
    }
  );

  if (error) {
    toast.error(error.message);
  }

  return {board: data, isLoading, error};
};

export const useDeleteBoard = (onBoardDeleted: () => void) => {
  const {getAccessTokenSilently} = useAuth0();
  const queryClient = useQueryClient();

  const deleteBoardRequest = async (boardId: string) => {
    const accessToken = await getAccessTokenSilently();
    const response = await fetch(`${API_BASE_URL}/api/my/board/${boardId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to delete board");
    }
  };

  const {mutateAsync: deleteBoard, isLoading} = useMutation(
    deleteBoardRequest,
    {
      onSuccess: () => {
        queryClient.invalidateQueries("boards");
        onBoardDeleted();
        toast.success("Board deleted!");
      },
      onError: (error: unknown) => {
        toast.error((error as Error).message);
      },
    }
  );

  return {
    deleteBoard,
    isLoading,
  };
};
