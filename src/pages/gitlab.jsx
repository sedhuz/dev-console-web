import { useState } from "react";
import { MRBoard } from "@/components/gitlab/mr-board";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

// Initial data structure
const initialColumns = {
  pending: {
    title: "Pending Review",
    items: [
      {
        id: 1,
        title: "Update user authentication",
        author: "John Doe",
        hasNotes: false,
        mrLink: "https://gitlab.com/project/-/merge_requests/1",
        sourceBranch: "feature/auth-update",
        targetBranch: "main",
        tags: ["backend", "security", "high-priority"],
        createdAt: "2024-03-20",
        updatedAt: "2024-03-21",
      },
      {
        id: 2,
        title: "Fix navigation bug",
        author: "Jane Smith",
        hasNotes: true,
        notes: "Need to test on mobile",
        mrLink: "https://gitlab.com/project/-/merge_requests/2",
        sourceBranch: "fix/navigation-issues",
        targetBranch: "develop",
        tags: ["frontend", "bug", "mobile"],
        createdAt: "2024-03-19",
        updatedAt: "2024-03-21",
      },
      {
        id: 5,
        title: "Add error handling",
        author: "Jane Smith",
        hasNotes: true,
        notes: "Need to test edge cases",
      },
    ],
  },
  inProgress: {
    title: "In Progress",
    items: [
      {
        id: 3,
        title: "Add dark mode support",
        author: "Mike Johnson",
        hasNotes: false,
      },
    ],
  },
  completed: {
    title: "Completed",
    items: [
      {
        id: 4,
        title: "Implement search feature",
        author: "Sarah Wilson",
        hasNotes: true,
        notes: "Deployed to staging",
      },
    ],
  },
};

export default function GitlabPage() {
  const [columns, setColumns] = useState(initialColumns);
  const [noteDialog, setNoteDialog] = useState({ open: false, mrId: null });
  const [noteText, setNoteText] = useState("");

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const { source, destination } = result;

    // Create a new copy of columns
    const newColumns = JSON.parse(JSON.stringify(columns));

    if (source.droppableId === destination.droppableId) {
      // Same column movement
      const column = newColumns[source.droppableId];
      const copiedItems = [...column.items];
      const [removed] = copiedItems.splice(source.index, 1);
      copiedItems.splice(destination.index, 0, removed);

      newColumns[source.droppableId].items = copiedItems;
    } else {
      // Moving between columns
      const sourceColumn = newColumns[source.droppableId];
      const destColumn = newColumns[destination.droppableId];
      const sourceItems = [...sourceColumn.items];
      const destItems = [...destColumn.items];
      const [removed] = sourceItems.splice(source.index, 1);
      destItems.splice(destination.index, 0, removed);

      newColumns[source.droppableId].items = sourceItems;
      newColumns[destination.droppableId].items = destItems;
    }

    setColumns(newColumns);
  };

  const handleAddNote = (mrId) => {
    // Find existing note if any
    let existingNote = "";
    Object.values(columns).forEach((column) => {
      column.items.forEach((mr) => {
        if (mr.id === mrId && mr.hasNotes) {
          existingNote = mr.notes;
        }
      });
    });
    setNoteText(existingNote);
    setNoteDialog({ open: true, mrId });
  };

  const handleSaveNote = () => {
    setColumns((prevColumns) => {
      const newColumns = { ...prevColumns };
      Object.keys(newColumns).forEach((columnId) => {
        newColumns[columnId].items = newColumns[columnId].items.map((mr) => {
          if (mr.id === noteDialog.mrId) {
            return {
              ...mr,
              hasNotes: Boolean(noteText.trim()),
              notes: noteText,
            };
          }
          return mr;
        });
      });
      return newColumns;
    });
    setNoteDialog({ open: false, mrId: null });
    setNoteText("");
  };

  return (
    <div className="flex flex-col flex-1 w-full">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Gitlab Dashboard
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage your merge requests and track development progress
          </p>
        </div>
      </div>

      {/* Rest of your GitLab page content */}
      <div className="flex-1 p-6">
        <div className="space-y-8 max-w-[1800px] mx-auto">
          <div className="w-full overflow-x-auto">
            <div className="min-w-[1024px] w-full">
              <MRBoard
                columns={columns}
                onDragEnd={onDragEnd}
                onAddNote={handleAddNote}
              />
            </div>
          </div>
        </div>
      </div>

      <Dialog
        open={noteDialog.open}
        onOpenChange={(open) => {
          if (!open) {
            setNoteDialog({ open, mrId: null });
            setNoteText("");
          }
        }}
      >
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Add Note</DialogTitle>
          </DialogHeader>
          <Textarea
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            placeholder="Add your notes here..."
            className="min-h-[150px] resize-none"
          />
          <DialogFooter className="gap-2 mt-4">
            <Button variant="outline">Cancel</Button>
            <Button onClick={handleSaveNote}>Save Note</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
