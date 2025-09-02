export const Note = ({
  type = "info",
  children,
}: {
  type?: "info" | "warning" | "tip";
  children: React.ReactNode;
}) => {
  const styles = {
    info: "border-blue-500 bg-blue-500/10 text-blue-200",
    warning: "border-yellow-500 bg-yellow-500/10 text-yellow-200",
    tip: "border-green-500 bg-green-500/10 text-green-200",
  };

  const icons = {
    info: "ℹ️",
    warning: "⚠️",
    tip: "💡",
  };

  return (
    <div className={`my-4 rounded-lg border-l-4 p-4 ${styles[type]}`}>
      <div className="flex items-start gap-2">
        <span className="text-xl">{icons[type]}</span>
        <div className="flex-1">{children}</div>
      </div>
    </div>
  );
};
