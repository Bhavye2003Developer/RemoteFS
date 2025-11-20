"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { DialogClose } from "@radix-ui/react-dialog";
import { Trash2 } from "lucide-react";

export default function DeleteItemBtn({
  filename,
  deleteItem,
}: {
  filename: string;
  deleteItem: () => void;
}) {
  return (
    <Dialog>
      <DialogTrigger
        onClick={(e) => e.stopPropagation()}
        className="
          p-2 rounded-lg transition
          text-red-600 hover:text-white
          hover:bg-red-600
          dark:text-red-400 dark:hover:bg-red-500 dark:hover:text-white
        "
      >
        <Trash2 size={18} />
      </DialogTrigger>

      <DialogContent className="rounded-2xl">
        <DialogHeader>
          <DialogTitle>
            Are you sure you want to delete{" "}
            <span className="text-red-600 font-bold">{filename}</span>?
          </DialogTitle>

          <DialogDescription className="pt-3">
            This action cannot be undone. The file or folder will be permanently
            removed.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>

          <DialogClose asChild>
            <Button
              onClick={(e) => {
                e.stopPropagation();
                deleteItem();
              }}
              className="bg-red-600 text-white hover:bg-red-700"
            >
              Yes, Delete
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
