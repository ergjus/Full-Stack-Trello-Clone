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
import LoadingButton from "../LoadingButton";
import {useCreateBoard} from "@/api/BoardApi";
import {useNavigate} from "react-router-dom";

const formSchema = z.object({
  boardName: z.string().min(1, "Title is required"),
  boardDescription: z.string().optional(),
});

type BoardFormData = z.infer<typeof formSchema>;

type Props = {
  onSave: (boardFormData: BoardFormData) => void;
  isLoading: boolean;
};

const CreateBoardDialog = ({isLoading}: Props) => {
  const navigate = useNavigate();
  const {createBoard} = useCreateBoard();

  const form = useForm<BoardFormData>({
    resolver: zodResolver(formSchema),
  });

  const handleSave = async (data: BoardFormData) => {
    try {
      const newBoard = await createBoard(data);
      if (newBoard && newBoard._id) {
        navigate(`/boards/${newBoard._id}`);
      }
    } catch (error) {
      console.error("Failed to create board:", error);
    }
  };

  return (
    <Dialog>
      <DialogTrigger>
        <Button className="bg-blue-600">Create Board</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Board</DialogTitle>
          <DialogDescription>Please enter the board title</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSave)} className="space-y-4">
            <FormField
              control={form.control}
              name="boardName"
              render={({field}) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input {...field} className="bg-white" />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="boardDescription"
              render={({field}) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter a short description for this board"
                      {...field}
                      className="bg-white"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <DialogFooter>
              {isLoading ? (
                <LoadingButton />
              ) : (
                <Button type="submit" className="bg-blue-600">
                  Create
                </Button>
              )}
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateBoardDialog;
