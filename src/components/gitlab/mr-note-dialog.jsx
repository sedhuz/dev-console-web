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
import { toast } from "sonner";
import { API_CONFIG } from "@/config";
export function MergeRequestNoteDialog({
  open,
  onClose,
  onSave,
  noteText,
  onNoteChange,
  projectId,
  mrIid,
}) {
  const handleSaveNote = async () => {
    try {
      const response = await fetch(
        `${API_CONFIG.baseUrl}/gitlab/merge-requests/${projectId}/${mrIid}/custom-fields`,
        {
          method: "POST",
          body: JSON.stringify({ notes: noteText }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Request:", {
        method: "POST",
        body: JSON.stringify({ notes: noteText }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log("Response:", response);
      if (!response.ok) {
        throw new Error("Failed to save note");
      }
      onSave(); // Call the original save function
      toast.success("Note saved successfully");
    } catch (error) {
      toast.error("Failed to save note");
      console.error("Error saving note:", error);
    }
  };

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
          <Button
            variant="outline"
            onClick={onClose}
            className="hover:cursor-pointer"
          >
            Cancel
          </Button>
          <Button onClick={handleSaveNote} className="hover:cursor-pointer">
            Save Note
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
