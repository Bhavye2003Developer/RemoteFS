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
        className="p-2 sm:p-1.5 rounded-lg text-red-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
      >
        <Trash2 className="w-4 h-4" />
      </DialogTrigger>

      <DialogContent className="rounded-2xl sm:p-4 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        <DialogHeader>
          <DialogTitle className="sm:text-base">
            Delete <span className="font-semibold">{filename}</span>?
          </DialogTitle>

          <DialogDescription className="pt-3 sm:text-sm text-gray-700 dark:text-gray-300">
            This action cannot be undone. The file or folder will be permanently
            removed.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="sm:flex sm:justify-end sm:gap-2">
          <DialogClose asChild>
            <Button variant="outline" className="sm:px-3 sm:py-1.5">
              Cancel
            </Button>
          </DialogClose>

          <DialogClose asChild>
            <Button
              onClick={(e) => {
                e.stopPropagation();
                deleteItem();
              }}
              className="sm:px-3 sm:py-1.5 bg-gray-800 text-white hover:bg-gray-700"
            >
              Yes, Delete
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
