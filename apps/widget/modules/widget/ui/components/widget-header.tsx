import { cn } from "@workspace/ui/lib/utils";

export const WidgetHeader = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <header className={cn(
      "relative bg-card border-b border-border",
      "after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#31AF5A]",
      className,
    )}>
      <div className="px-4 py-3">
        {children}
      </div>
    </header>
  );
};
