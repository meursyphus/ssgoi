export const Badge = ({
  children,
  variant = "default",
}: {
  children: React.ReactNode;
  variant?: "default" | "success" | "warning";
}) => {
  const styles = {
    default: "bg-zinc-800 text-zinc-300",
    success: "bg-zinc-800 text-zinc-300",
    warning: "bg-zinc-700 text-zinc-300",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${styles[variant]}`}
    >
      {children}
    </span>
  );
};
