export default function DiagramsPage() {
  return (
    <div className="flex flex-col flex-1 w-full">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Diagrams</h1>
          <p className="text-sm text-muted-foreground">
            Save diagrams and flowcharts
          </p>
        </div>
      </div>
      {/* Excalidraw embed, takes up the rest of the page */}
      <div className="flex-1">
        <iframe
          src="https://excalidraw.com" // or point at a specific share link: e.g. "https://excalidraw.com/#json=<yourExportedJSON>"
          title="Excalidraw Editor"
          frameBorder="0"
          className="w-full h-full"
        />
      </div>
    </div>
  );
}
