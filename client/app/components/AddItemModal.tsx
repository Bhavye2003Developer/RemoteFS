import { useState, type ReactNode, useEffect } from "react";
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

  // Reset input on close
  useEffect(() => {
    setItemName("");
  }, []);

  return (
    <Dialog>
      {children}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{label}</DialogTitle>
          <DialogDescription className="pt-3">
            <Input
              autoFocus
              type="text"
              placeholder={placeholder}
              onChange={(e) => setItemName(e.target.value)}
              value={itemName}
            />
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <DialogClose asChild>
            <Button
              onClick={() => {
                if (itemName.trim().length === 0) return;
                createItem(itemName.trim());
                setItemName("");
              }}
              disabled={itemName.trim().length < 1}
            >
              Create
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
