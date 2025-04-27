// MergeRequestBoard.jsx
import { useState, useRef, useEffect } from "react";
import { MergeRequestCard } from "./mr-card";
import { MergeRequestNoteDialog } from "./mr-note-dialog";
import { GripVertical } from "lucide-react";

export function MergeRequestBoard({ columns, onColumnUpdate, onCopySuccess }) {
  const [dragging, setDragging] = useState(null);
  const [noteDialog, setNoteDialog] = useState({
    open: false,
    projectId: null,
    mrIid: null,
  });
  const [noteText, setNoteText] = useState("");
  const [dropTarget, setDropTarget] = useState({ columnId: null, index: null });
  const dragItemRef = useRef(null);
  const dragPreviewRef = useRef(null);

  // Create a hidden preview element for drag operations
  useEffect(() => {
    const preview = document.createElement("div");
    preview.style.position = "absolute";
    preview.style.top = "-9999px";
    preview.style.left = "-9999px";
    preview.style.width = "1px";
    preview.style.height = "1px";
    preview.style.opacity = "0.01";
    document.body.appendChild(preview);
    dragPreviewRef.current = preview;

    return () => {
      if (dragPreviewRef.current) {
        document.body.removeChild(dragPreviewRef.current);
      }
    };
  }, []);

  // Find merge request by ID across all columns
  const findMergeRequestById = (id) => {
    for (const columnId in columns) {
      const item = columns[columnId].items.find((item) => item.id === id);
      if (item) return { columnId, item };
    }
    return null;
  };

  // Handle drag start
  const handleDragStart = (e, columnId, itemId) => {
    // Use the hidden element as drag image to avoid flickering
    if (dragPreviewRef.current) {
      e.dataTransfer.setDragImage(dragPreviewRef.current, 0, 0);
    }

    // Save drag information
    dragItemRef.current = { columnId, itemId };
    setDragging({ columnId, itemId });

    // Add dragging class to improve styling
    e.currentTarget.classList.add("is-dragging");

    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", itemId);
  };

  // Handle dropping an item
  const handleDrop = (targetColumnId, targetIndex) => {
    if (!dragging) return;

    const { columnId: sourceColumnId, itemId } = dragging;

    const updatedColumns = { ...columns };
    const sourceColumn = updatedColumns[sourceColumnId];
    const destColumn = updatedColumns[targetColumnId];

    const sourceItems = Array.from(sourceColumn.items);
    const destItems = Array.from(destColumn.items);

    const movedItemIndex = sourceItems.findIndex((item) => item.id === itemId);
    const [movedItem] = sourceItems.splice(movedItemIndex, 1);

    // Update status based on the column
    movedItem.status =
      targetColumnId === "completed"
        ? "merged"
        : targetColumnId === "inProgress"
        ? "in-progress"
        : "pending";

    if (sourceColumnId === targetColumnId) {
      sourceItems.splice(targetIndex, 0, movedItem);
      updatedColumns[sourceColumnId] = { ...sourceColumn, items: sourceItems };
    } else {
      destItems.splice(targetIndex, 0, movedItem);
      updatedColumns[sourceColumnId] = { ...sourceColumn, items: sourceItems };
      updatedColumns[targetColumnId] = { ...destColumn, items: destItems };
    }

    onColumnUpdate(updatedColumns);
    resetDragState();
  };

  // Handle drag over for column
  const handleColumnDragOver = (e, columnId) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = "move";

    if (dragging && dropTarget.columnId !== columnId) {
      setDropTarget({ columnId, index: columns[columnId].items.length });
    }
  };

  // Handle drag over for card position
  const handleCardDragOver = (e, columnId, index) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = "move";

    const targetRect = e.currentTarget.getBoundingClientRect();
    const mouseY = e.clientY - targetRect.top;
    const threshold = targetRect.height / 2;

    // If mouse is in the top half of the card, place before; otherwise, place after
    const insertIndex = mouseY < threshold ? index : index + 1;

    if (
      dragging &&
      (dropTarget.columnId !== columnId || dropTarget.index !== insertIndex)
    ) {
      setDropTarget({ columnId, index: insertIndex });
    }
  };

  // Handle drag end (whether successful drop or not)
  const handleDragEnd = (e) => {
    // Remove dragging class from all elements
    document.querySelectorAll(".is-dragging").forEach((el) => {
      el.classList.remove("is-dragging");
    });

    resetDragState();
  };

  const resetDragState = () => {
    setDragging(null);
    setDropTarget({ columnId: null, index: null });
    dragItemRef.current = null;
  };

  const handleAddNote = (projectId, mrIid) => {
    let existingNote = "";
    Object.values(columns).forEach((column) => {
      column.items.forEach((item) => {
        if (
          item.iid === mrIid &&
          item.project_id === projectId &&
          item.custom_fields.notes
        ) {
          existingNote = item.custom_fields.notes;
        }
      });
    });
    setNoteText(existingNote);
    setNoteDialog({ open: true, projectId, mrIid });
  };

  const handleSaveNote = () => {
    const updatedColumns = { ...columns };
    Object.keys(updatedColumns).forEach((colId) => {
      updatedColumns[colId].items = updatedColumns[colId].items.map((item) => {
        if (item.id === noteDialog.mrId) {
          return { ...item, hasNotes: !!noteText.trim(), notes: noteText };
        }
        return item;
      });
    });

    onColumnUpdate(updatedColumns);
    setNoteDialog({ open: false, projectId: null, mrIid: null });
    setNoteText("");
  };

  const closeDialog = () => {
    setNoteDialog({ open: false, projectId: null, mrIid: null });
    setNoteText("");
  };

  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text).then(() => {
      onCopySuccess(`${type}: ${text}`);
    });
  };

  // Render the columns and items with placeholders
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Object.entries(columns).map(([columnId, column]) => (
          <div
            key={columnId}
            className={`board-column bg-card rounded-lg border shadow-sm p-4 min-h-80 flex flex-col transition-colors duration-300
              ${
                dropTarget.columnId === columnId
                  ? "bg-primary/5 border-primary"
                  : "border-muted"
              }`}
            onDragOver={(e) => handleColumnDragOver(e, columnId)}
            onDrop={() => handleDrop(columnId, dropTarget.index)}
          >
            <h2 className="font-semibold text-lg mb-4 text-foreground">
              {column.title}
            </h2>
            <div className="flex-1 space-y-3">
              {column.items.map((mergeRequest, index) => {
                const isBeingDragged =
                  dragging && dragging.itemId === mergeRequest.id;
                const showPlaceholderBefore =
                  dropTarget.columnId === columnId &&
                  dropTarget.index === index &&
                  !(isBeingDragged && dragging.columnId === columnId);

                return (
                  <div key={`${mergeRequest.id}-container`}>
                    {/* Placeholder shown before the card if needed */}
                    {showPlaceholderBefore && (
                      <div className="h-32 border-2 border-primary border-dashed rounded-md mb-3 bg-primary/5" />
                    )}

                    <div
                      key={mergeRequest.id}
                      draggable
                      onDragStart={(e) =>
                        handleDragStart(e, columnId, mergeRequest.id)
                      }
                      onDragOver={(e) => handleCardDragOver(e, columnId, index)}
                      onDragEnd={handleDragEnd}
                      onDrop={(e) => {
                        e.stopPropagation();
                        handleDrop(columnId, index);
                      }}
                      className={`relative card-item transition-all duration-300 ease-in-out transform
    ${isBeingDragged ? "scale-95 opacity-50" : ""}
  `}
                    >
                      <div className="absolute -right-2 -top-2 bg-muted-foreground/50 text-background cursor-move p-1 z-20 hover:bg-primary/75 rounded-md">
                        <GripVertical size={16} />
                      </div>
                      <MergeRequestCard
                        mergeRequest={mergeRequest}
                        onAddNote={() =>
                          handleAddNote(
                            mergeRequest.project_id,
                            mergeRequest.iid
                          )
                        }
                        onCopy={copyToClipboard}
                      />
                    </div>

                    {/* Placeholder shown after the last card if needed */}
                    {index === column.items.length - 1 &&
                      dropTarget.columnId === columnId &&
                      dropTarget.index === column.items.length && (
                        <div className="h-32 border-2 border-primary border-dashed rounded-md mt-3 bg-primary/10 transition-all duration-300" />
                      )}
                  </div>
                );
              })}

              {column.items.length === 0 && (
                <div
                  className={`py-8 text-center text-muted-foreground text-sm border rounded-md
                  ${
                    dropTarget.columnId === columnId
                      ? "border-2 border-primary border-dashed"
                      : "border-dashed"
                  }`}
                >
                  Drop items here
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <MergeRequestNoteDialog
        open={noteDialog.open}
        onClose={closeDialog}
        onSave={handleSaveNote}
        noteText={noteText}
        onNoteChange={(e) => setNoteText(e.target.value)}
        projectId={noteDialog.projectId}
        mrIid={noteDialog.mrIid}
      />
    </>
  );
}
