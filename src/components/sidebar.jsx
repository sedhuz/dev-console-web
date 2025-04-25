export function Sidebar({ isCollapsed, onToggle }) {
  return (
    <aside
      className={`${
        isCollapsed ? "w-16" : "w-64"
      } border-r transition-all duration-300`}
    >
      <div className="flex items-center justify-between p-4">
        <h2 className={`font-semibold ${isCollapsed ? "hidden" : "block"}`}>
          Dashboard
        </h2>
        <button onClick={onToggle} className="p-1.5 rounded-lg hover:bg-accent">
          {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>
      {/* Rest of your sidebar content */}
    </aside>
  );
}
