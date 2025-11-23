import { useState, type ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { DialogClose } from "@radix-ui/react-dialog";

export default function AddItemModal({
  children,
  createItem,
  type,
}: {
  children: ReactNode;
  createItem: (itemName: string) => void;
  type: "file" | "folder";
}) {
  const [itemName, setItemName] = useState("");
  const label = type === "file" ? "Create New File" : "Create New Folder";
  const placeholder =
    type === "file" ? "Enter file name..." : "Enter folder name...";

  return (
    <Dialog>
      {children}

      <DialogContent className="rounded-2xl sm:p-4 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        <DialogHeader>
          <DialogTitle className="sm:text-base">{label}</DialogTitle>

          <DialogDescription className="pt-3 sm:text-sm text-gray-700 dark:text-gray-300">
            <Input
              autoFocus
              type="text"
              placeholder={placeholder}
              onChange={(e) => setItemName(e.target.value)}
              value={itemName}
              className="sm:text-sm sm:h-9 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            />
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="sm:flex sm:justify-end">
          <DialogClose asChild>
            <Button
              onClick={() => {
                if (!itemName.trim()) return;
                createItem(itemName.trim());
                setItemName("");
              }}
              disabled={itemName.trim().length < 1}
              className="sm:px-3 sm:py-1.5 bg-gray-900 text-white hover:bg-gray-800"
            >
              Create
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
