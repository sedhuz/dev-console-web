export default function NotesPage() {
  return (
    <div className="flex flex-col flex-1 w-full">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Notes</h1>
          <p className="text-sm text-muted-foreground">
            Save your notes and thoughts
          </p>
        </div>
      </div>
      {/* Embed, takes up the rest of the page */}
      <div className="flex-1">
        <iframe
          src="https://app.bangle.io/ws#route=ws-home&wsName=Main" // or point at a specific link
          title="Bangle.io"
          className="w-full h-full"
        />
      </div>
    </div>
  );
}
