// MergeRequestNoteDialog.jsx
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export function MergeRequestNoteDialog({
  open,
  onClose,
  onSave,
  noteText,
  onNoteChange,
}) {
  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {noteText ? "Edit Note" : "Add Note"}
          </DialogTitle>
        </DialogHeader>
        <Textarea
          value={noteText}
          onChange={onNoteChange}
          placeholder="Add your notes here..."
          className="min-h-32 resize-none"
        />
        <DialogFooter className="gap-2 mt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={onSave}>Save Note</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
