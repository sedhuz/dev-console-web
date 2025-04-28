// MergeRequestBoard.jsx
import { useState, useRef, useEffect } from "react";
import { MergeRequestCard } from "./mr-card";
import { MergeRequestNoteDialog } from "./mr-note-dialog";
import { GripVertical } from "lucide-react";
import { API_CONFIG } from "@/config";
import { toast } from "sonner";

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

  // --- MODIFIED: Handle dropping an item ---
  const handleDrop = async (targetColumnId, targetIndex) => {
    if (!dragging) return;

    const { columnId: sourceColumnId, itemId } = dragging;
    const originalColumns = JSON.parse(JSON.stringify(columns)); // Deep copy for revert

    // Find the item being moved and its details
    const movedItemInfo = findMergeRequestById(itemId); // Use existing helper
    if (
      !movedItemInfo ||
      !movedItemInfo.item.project_id ||
      !movedItemInfo.item.iid
    ) {
      console.error(
        "Could not find dragged item details (ID, ProjectID, IID)."
      );
      resetDragState();
      return;
    }
    const { item: movedItem, columnId: actualSourceColumnId } = movedItemInfo;
    const projectId = movedItem.project_id;
    const mrIid = movedItem.iid;

    // Ensure sourceColumnId from state matches found item's column
    if (actualSourceColumnId !== sourceColumnId) {
      console.warn(
        "Drag state source column mismatch. Using actual source column."
      );
      // sourceColumnId = actualSourceColumnId; // Optionally correct it, though logic below handles it
    }

    // --- Optimistic UI Update ---
    const updatedColumns = JSON.parse(JSON.stringify(columns)); // Use a fresh deep copy
    const sourceColumn = updatedColumns[actualSourceColumnId]; // Use actual source
    const destColumn = updatedColumns[targetColumnId];

    const sourceItems = Array.from(sourceColumn.items);
    const destItems = Array.from(destColumn.items);

    const movedItemIndex = sourceItems.findIndex((item) => item.id === itemId);
    if (movedItemIndex === -1) {
      console.error(
        "Could not find item index in source column for optimistic update."
      );
      resetDragState();
      return; // Avoid proceeding if item not found
    }
    // Remove item from source (using the found item)
    sourceItems.splice(movedItemIndex, 1);

    // Add item to destination at the correct index
    if (actualSourceColumnId === targetColumnId) {
      // Moving within the same column
      sourceItems.splice(targetIndex, 0, movedItem);
      updatedColumns[actualSourceColumnId] = {
        ...sourceColumn,
        items: sourceItems,
      };
    } else {
      // Moving to a different column
      destItems.splice(targetIndex, 0, movedItem);
      updatedColumns[actualSourceColumnId] = {
        ...sourceColumn,
        items: sourceItems,
      };
      updatedColumns[targetColumnId] = { ...destColumn, items: destItems };
    }

    // Apply optimistic update to the UI
    // If parent manages state: onColumnUpdate(updatedColumns);

    resetDragState(); // Reset drag state early for smoother UI

    // --- Backend Update ---
    try {
      console.log(
        `Updating backend: MR !${mrIid} (Project ${projectId}) moved to group ${targetColumnId}`
      );
      const response = await fetch(
        `${API_CONFIG.baseUrl}/gitlab/merge-requests/${projectId}/${mrIid}/custom-fields`,
        {
          method: "POST",
          // Assuming the backend expects the target column ID in a 'group' field
          body: JSON.stringify({ group: targetColumnId }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(
          `Failed to update MR group: ${response.status} ${errorData}`
        );
      }

      // Backend update successful
      toast.success(`Moved MR !${mrIid} to ${columns[targetColumnId].title}`);
      // If parent manages state and you updated optimistically above,
      // you might call onColumnUpdate again here to ensure parent has the final confirmed state
      // or if the API returns the updated MR, merge that data.
      // For now, we assume the optimistic update is sufficient if API succeeds.
      if (onColumnUpdate) {
        // Ensure the final state is propagated if parent manages it
        onColumnUpdate(updatedColumns);
      }
    } catch (error) {
      console.error("Error updating merge request group:", error);
      toast.error(`Failed to move MR !${mrIid}. Reverting change.`);
      // *** CHANGE HERE: Call the prop function to revert state in parent ***
      if (onColumnUpdate) {
        onColumnUpdate(originalColumns); // Notify parent to revert to original state
      } else {
        console.warn(
          "onColumnUpdate prop is missing, cannot revert parent state."
        );
      }
      // REMOVED: setColumns(originalColumns);
    } finally {
      resetDragState();
    }
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
    // Find the specific item to get its current note
    for (const colId in columns) {
      const item = columns[colId].items.find(
        (item) => item.project_id === projectId && item.iid === mrIid
      );
      // Ensure custom_fields exists before accessing notes
      if (
        item &&
        item.custom_fields &&
        typeof item.custom_fields.notes === "string"
      ) {
        existingNote = item.custom_fields.notes;
        break; // Found the item, no need to continue loop
      }
    }
    setNoteText(existingNote); // Set the text for the dialog
    setNoteDialog({ open: true, projectId, mrIid }); // Open the dialog
  };

  // --- CORRECTED: Callback function after note is saved via API in Dialog ---
  const handleNoteSavedCallback = (
    savedProjectId,
    savedMrIid,
    savedNoteText
  ) => {
    console.log(`Callback: Note saved for MR !${savedMrIid}. Updating state.`);
    // Use the 'columns' prop directly for the base state
    const currentColumns = JSON.parse(JSON.stringify(columns)); // Deep copy from prop
    let itemFoundAndUpdated = false;

    for (const colId in currentColumns) {
      currentColumns[colId].items = currentColumns[colId].items.map((item) => {
        if (item.project_id === savedProjectId && item.iid === savedMrIid) {
          if (!item.custom_fields) {
            item.custom_fields = {};
          }
          item.custom_fields.notes = savedNoteText;
          item.hasNotes = !!savedNoteText?.trim();
          itemFoundAndUpdated = true;
          return item;
        }
        return item;
      });
    }

    if (itemFoundAndUpdated) {
      // *** CHANGE HERE: Call the prop function instead of setColumns ***
      if (onColumnUpdate) {
        onColumnUpdate(currentColumns); // Notify parent with the updated state
      } else {
        console.warn(
          "onColumnUpdate prop is missing, cannot update parent state."
        );
      }
    } else {
      console.warn("Item not found in state after note save callback.");
    }

    closeDialog();
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
      <div className="scrollbar-custom pb-2 flex overflow-x-auto gap-6">
        <h2 className="font-semibold text-lg mb-4 text-foreground">
          {column.title}
        </h2>
        {Object.entries(columns).map(([columnId, column]) => (
          <div
            key={columnId}
            className={`board-column scrollbar-custom bg-card rounded-lg border shadow-sm p-4 min-h-80 flex flex-col transition-colors duration-300 overflow-y-auto max-h-[calc(100vh-145px)] min-w-[450px]`}
            onDragOver={(e) => handleColumnDragOver(e, columnId)}
            onDrop={() => handleDrop(columnId, dropTarget.index)}
          >
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
        // Pass the *callback* function to be executed AFTER successful API save in dialog
        onSave={handleNoteSavedCallback}
        noteText={noteText} // Pass current text state
        onNoteChange={(e) => setNoteText(e.target.value)} // Update local text state directly
        projectId={noteDialog.projectId}
        mrIid={noteDialog.mrIid}
      />
    </>
  );
}
