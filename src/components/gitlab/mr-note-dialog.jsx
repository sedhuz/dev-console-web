// --- MergeRequestNoteDialog.jsx ---
import React, { useState } from "react"; // Make sure React and useState are imported
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
import { Loader2 } from "lucide-react"; // Import loader

export function MergeRequestNoteDialog({
  open,
  onClose,
  onSave, // This prop is the callback function from the parent (MergeRequestBoard)
  noteText, // Current note text from parent state
  onNoteChange, // Function to update parent's text state
  projectId,
  mrIid,
}) {
  const [isSaving, setIsSaving] = useState(false); // Add saving state

  // --- MODIFIED: Renamed and updated save handler ---
  const handleSaveChanges = async () => {
    if (isSaving) return; // Prevent double clicks
    setIsSaving(true);

    try {
      const response = await fetch(
        `${API_CONFIG.baseUrl}/gitlab/merge-requests/${projectId}/${mrIid}/custom-fields`,
        {
          method: "POST",
          body: JSON.stringify({ notes: noteText }), // Send current text
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Response [Save Note]:", response);
      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Failed to save note: ${response.status} ${errorData}`);
      }

      // API call successful!
      toast.success("Note saved successfully");

      // Call the onSave callback passed from the parent board,
      // providing the data needed to update the board's state.
      if (onSave) {
        onSave(projectId, mrIid, noteText); // Pass saved text back
      } else {
        console.warn("onSave prop is missing from MergeRequestNoteDialog");
      }
      // Do not close the dialog here; the parent's callback (handleNoteSavedCallback) will close it.
    } catch (error) {
      toast.error(`Failed to save note: ${error.message}`);
      console.error("Error saving note:", error);
    } finally {
      setIsSaving(false); // Reset saving state
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => !isOpen && !isSaving && onClose()}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            Note for MR !{mrIid}
          </DialogTitle>
        </DialogHeader>
        <Textarea
          value={noteText}
          onChange={onNoteChange} // Update parent state directly
          placeholder="Add your notes here..."
          className="min-h-32 resize-none"
          disabled={isSaving} // Disable while saving
        />
        <DialogFooter className="gap-2 mt-4">
          <Button
            variant="outline"
            onClick={onClose}
            className="hover:cursor-pointer"
            disabled={isSaving} // Disable while saving
          >
            Cancel
          </Button>
          <Button
            onClick={handleSaveChanges} // Call the updated handler
            className="hover:cursor-pointer"
            disabled={isSaving} // Disable while saving
          >
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
              </>
            ) : (
              "Save Note"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
