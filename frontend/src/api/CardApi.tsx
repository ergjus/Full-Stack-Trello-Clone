import {Card} from "@/types";
import {useAuth0} from "@auth0/auth0-react";
import {useMutation, useQuery, useQueryClient} from "react-query";
import {toast} from "sonner";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

type CreateCardRequest = {
  cardTitle: string;
  listId: string;
  description?: string;
  position?: number;
};

export const useCreateCard = () => {
  const {getAccessTokenSilently} = useAuth0();

  const createCardRequest = async (card: CreateCardRequest) => {
    const accessToken = await getAccessTokenSilently();
    const response = await fetch(`${API_BASE_URL}/api/my/card`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(card),
    });

    if (!response.ok) {
      throw new Error("Failed to create card!");
    }
  };

  const {
    mutateAsync: createCard,
    isLoading,
    error,
    isSuccess,
  } = useMutation(createCardRequest);

  if (isSuccess) {
    toast.success("Card created!");
  }

  if (error) {
    toast.error(error.toString());
  }

  return {
    createCard,
    isLoading,
  };
};

export const useGetCardsByList = (listId: string) => {
  const {getAccessTokenSilently} = useAuth0();

  const fetchCards = async (): Promise<Card[]> => {
    const accessToken = await getAccessTokenSilently();
    const response = await fetch(`${API_BASE_URL}/api/my/card/list/${listId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error("Failed to fetch lists on card api");
    }

    return response.json();
  };

  const {data, isLoading, error, refetch} = useQuery<Card[], Error>(
    ["cards", listId],
    () => fetchCards(),
    {enabled: !!listId}
  );

  if (error) {
    toast.error(error.message);
  }

  return {cards: data, isLoading, error, refetch};
};

export const useMoveCard = () => {
  const {getAccessTokenSilently} = useAuth0();
  const queryClient = useQueryClient();

  const moveCardRequest = async ({
    cardId,
    listId,
    position,
  }: {
    cardId: string;
    listId: string;
    position: number;
  }) => {
    const accessToken = await getAccessTokenSilently();
    const response = await fetch(
      `${API_BASE_URL}/api/my/card/${cardId}/position`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({listId, position}),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to move card");
    }
  };

  const {
    mutateAsync: moveCard,
    isLoading,
    error,
  } = useMutation(moveCardRequest, {
    onSuccess: () => {
      queryClient.invalidateQueries("cards");
    },
  });
  if (error) {
    console.log("error on cardapi movecard", error);
  }

  return {moveCard, isLoading};
};

export const useDeleteCard = (onCardDeleted: () => void) => {
  const {getAccessTokenSilently} = useAuth0();
  const queryClient = useQueryClient();

  const deleteCardRequest = async (cardId: string) => {
    const accessToken = await getAccessTokenSilently();
    const response = await fetch(`${API_BASE_URL}/api/my/card/${cardId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to delete card");
    }
  };

  const {mutateAsync: deleteCard, isLoading} = useMutation(deleteCardRequest, {
    onSuccess: () => {
      queryClient.invalidateQueries("cards");
      onCardDeleted();
      toast.success("Card deleted!");
    },
    onError: (error: unknown) => {
      toast.error((error as Error).message);
    },
  });

  return {
    deleteCard,
    isLoading,
  };
};
