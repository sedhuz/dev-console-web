import { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { MRCard } from "./mr-card";
import { StrictMode } from "react";

export function MRBoard({ columns, onDragEnd, onAddNote }) {
  // Add state to force remount when needed
  const [enabled, setEnabled] = useState(false);

  // Enable drag and drop after mount
  useState(() => {
    const animation = requestAnimationFrame(() => setEnabled(true));
    return () => {
      cancelAnimationFrame(animation);
      setEnabled(false);
    };
  }, []);

  if (!enabled) {
    return null;
  }

  const getColumnStyle = (columnId) => {
    const styles = {
      pending:
        "border-blue-200/50 bg-blue-50/50 dark:border-blue-900/50 dark:bg-blue-950/50",
      inProgress:
        "border-amber-200/50 bg-amber-50/50 dark:border-amber-900/50 dark:bg-amber-950/50",
      completed:
        "border-green-200/50 bg-green-50/50 dark:border-green-900/50 dark:bg-green-950/50",
    };
    return styles[columnId] || "";
  };

  return (
    <StrictMode>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-3 gap-6 w-full">
          {Object.entries(columns).map(([columnId, column]) => (
            <div
              key={columnId}
              className={`bg-card rounded-lg border shadow-sm ${getColumnStyle(
                columnId
              )}`}
            >
              <div className="p-3 border-b">
                <h2 className="font-semibold flex items-center justify-between">
                  {column.title}
                  <span className="text-sm bg-primary/10 text-primary px-2 py-0.5 rounded-md">
                    {column.items.length}
                  </span>
                </h2>
              </div>
              <Droppable droppableId={columnId}>
                {(provided, snapshot) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className={`p-3 space-y-2 min-h-[500px] max-h-[calc(100vh-300px)] overflow-y-auto transition-colors ${
                      snapshot.isDraggingOver ? "bg-muted/50" : ""
                    }`}
                  >
                    {column.items.map((mr, index) => (
                      <Draggable
                        key={mr.id}
                        draggableId={mr.id.toString()}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            className={`transition-all ${
                              snapshot.isDragging
                                ? "opacity-50 rotate-2 scale-105"
                                : ""
                            }`}
                          >
                            <MRCard
                              mr={mr}
                              onAddNote={onAddNote}
                              dragHandleProps={provided.dragHandleProps}
                            />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>
    </StrictMode>
  );
}
