import React from "react";
import {Popover, PopoverTrigger, PopoverContent} from "@radix-ui/react-popover";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {useForm} from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import {useCreateCard} from "@/api/CardApi";
import {SquarePlus} from "lucide-react";

const formSchema = z.object({
  cardTitle: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  // position: z.preprocess(
  //   (val) => Number(val),
  //   z.number().min(0, "Position is required")
  // ),
});

type CardFormData = z.infer<typeof formSchema>;

type CreateCardProps = {
  listId: string;
  onCardCreated: () => void;
};

const CreateCard: React.FC<CreateCardProps> = ({listId, onCardCreated}) => {
  const form = useForm<CardFormData>({
    resolver: zodResolver(formSchema),
  });

  const {createCard, isLoading} = useCreateCard();

  const handleSubmit = async (data: CardFormData) => {
    await createCard({
      cardTitle: data.cardTitle,
      description: data.description,
      listId,
    });
    onCardCreated();
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          className="text-white hover:text-blue-700 hover:bg-transparent">
          <SquarePlus size={30} />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        side="bottom"
        className="bg-blue-400 p-4 rounded shadow max-w-sm w-full">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4">
            <FormField
              control={form.control}
              name="cardTitle"
              render={({field}) => (
                <FormItem>
                  <FormLabel className="text-white">Title</FormLabel>
                  <FormControl>
                    <Input {...field} className="bg-white" />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({field}) => (
                <FormItem>
                  <FormLabel className="text-white">Description</FormLabel>
                  <FormControl>
                    <textarea
                      {...field}
                      className=" mt-1 block w-full p-2 rounded bg-white"
                    />
                    {/* <Input as="textarea" {...field} className="bg-white" /> */}
                  </FormControl>
                </FormItem>
              )}
            />
            {/* <FormField
              control={form.control}
              name="position"
              render={({field}) => (
                <FormItem>
                  <FormLabel className="text-white">Position</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} className="bg-white" />
                  </FormControl>
                </FormItem>
              )}
            /> */}
            <Button className="bg-blue-800" type="submit" disabled={isLoading}>
              {isLoading ? "Creating..." : "Create"}
            </Button>
          </form>
        </Form>
      </PopoverContent>
    </Popover>
  );
};

export default CreateCard;
