import {useAuth0} from "@auth0/auth0-react";
import {useMutation, useQuery, useQueryClient} from "react-query";
import {toast} from "sonner";
import {List} from "@/types";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

type CreateListRequest = {
  listTitle: string;
  boardId: string;
};

export const useCreateList = (onSuccess: () => void) => {
  const {getAccessTokenSilently} = useAuth0();

  const createListRequest = async (list: CreateListRequest) => {
    const accessToken = await getAccessTokenSilently();
    const response = await fetch(`${API_BASE_URL}/api/my/list`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(list),
    });

    if (!response.ok) {
      throw new Error("Failed to create list");
    }
  };

  const {
    mutateAsync: createList,
    isLoading,
    error,
    isSuccess,
  } = useMutation(createListRequest, {
    onSuccess: () => {
      toast.success("List created!");
      onSuccess();
    },
  });

  return {createList, isLoading, error, isSuccess};
};

export const useGetListsByBoard = (boardId: string) => {
  const {getAccessTokenSilently} = useAuth0();

  const fetchLists = async (): Promise<List[]> => {
    const accessToken = await getAccessTokenSilently();
    const response = await fetch(
      `${API_BASE_URL}/api/my/list/board/${boardId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch lists");
    }
    return response.json();
  };

  const {data, isLoading, error, refetch} = useQuery<List[], Error>(
    ["lists", boardId],
    () => fetchLists(),
    {
      enabled: !!boardId,
    }
  );

  if (error) {
    toast.error(error.message);
  }

  return {lists: data, isLoading, error, refetch};
};

export const useDeleteList = (onListDeleted: () => void) => {
  const {getAccessTokenSilently} = useAuth0();
  const queryClient = useQueryClient();

  const deleteListRequest = async (listId: string) => {
    const accessToken = await getAccessTokenSilently();
    const response = await fetch(`${API_BASE_URL}/api/my/list/${listId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to delete list");
    }
  };

  const {mutateAsync: deleteList, isLoading} = useMutation(deleteListRequest, {
    onSuccess: () => {
      queryClient.invalidateQueries("lists");
      onListDeleted();
      toast.success("List deleted!");
    },
    onError: (error: unknown) => {
      toast.error((error as Error).message);
    },
  });

  return {
    deleteList,
    isLoading,
  };
};
