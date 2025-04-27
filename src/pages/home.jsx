export default function HomePage() {
  return (
    <div className="flex flex-col flex-1 w-full">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Dev Console</h1>
          <p className="text-sm text-muted-foreground">
            Welcome to the Dev Console
          </p>
        </div>
      </div>
    </div>
  );
}
