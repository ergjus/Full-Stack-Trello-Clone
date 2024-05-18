import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {Button} from "../ui/button";
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
import {useCreateList} from "../../api/ListApi";
import {SquarePlus} from "lucide-react";

const formSchema = z.object({
  listTitle: z.string().min(1, "Title is required"),
});

type ListFormData = z.infer<typeof formSchema>;

type Props = {
  boardId: string;
  onListCreated: () => void;
};

const CreateList: React.FC<Props> = ({boardId, onListCreated}) => {
  const form = useForm<ListFormData>({
    resolver: zodResolver(formSchema),
  });

  const {createList, isLoading} = useCreateList(onListCreated);

  const handleSubmit = async (data: ListFormData) => {
    await createList({...data, boardId});
  };

  return (
    <Dialog>
      <DialogTrigger>
        <Button className="mt-2 bg-blue-500 flex gap-2">
          <SquarePlus></SquarePlus>
          New List
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New List</DialogTitle>
          <DialogDescription>
            Fill out the required data and click create.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4">
            <FormField
              control={form.control}
              name="listTitle"
              render={({field}) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input {...field} className="bg-white" />
                  </FormControl>
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button
                className="bg-blue-800"
                type="submit"
                disabled={isLoading}>
                {isLoading ? "Creating..." : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateList;
