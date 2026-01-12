import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

// Sidebar Context
export const SidebarContext = React.createContext<{
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}>({
  isOpen: true,
  setIsOpen: () => { },
});

// Sidebar Provider
export function SidebarProvider({
  children,
  defaultOpen = true,
}: {
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [isOpen, setIsOpen] = React.useState(defaultOpen);

  return (
    <SidebarContext.Provider value={{ isOpen, setIsOpen }}>
      {children}
    </SidebarContext.Provider>
  );
}

// Sidebar Root
const Sidebar = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  const { isOpen } = React.useContext(SidebarContext);

  return (
    <aside
      ref={ref}
      className={cn(
        "h-full border-r-2 border-black bg-white transition-all duration-300 flex flex-col",
        isOpen ? "w-64" : "w-16",
        className
      )}
      {...props}
    >
      {children}
    </aside>
  );
});
Sidebar.displayName = "Sidebar";

// Sidebar Header
const SidebarHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  const { isOpen } = React.useContext(SidebarContext);

  return (
    <div
      ref={ref}
      className={cn(
        "p-4",
        isOpen ? "flex items-center justify-between" : "flex items-center justify-center px-0",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});
SidebarHeader.displayName = "SidebarHeader";

// Sidebar Content
const SidebarContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex-1 overflow-y-auto", className)} {...props} />
));
SidebarContent.displayName = "SidebarContent";

// Sidebar Footer
const SidebarFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  const { isOpen } = React.useContext(SidebarContext);

  return (
    <div
      ref={ref}
      className={cn(
        "",
        isOpen ? "p-4 text-center" : "flex items-center justify-center p-2",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});
SidebarFooter.displayName = "SidebarFooter";

// Sidebar Menu
const SidebarMenu = React.forwardRef<
  HTMLUListElement,
  React.HTMLAttributes<HTMLUListElement>
>(({ className, ...props }, ref) => {
  const { isOpen } = React.useContext(SidebarContext);

  return (
    <ul
      ref={ref}
      className={cn(
        "space-y-1",
        !isOpen ? "px-2" : "px-2",
        className
      )}
      {...props}
    />
  );
});
SidebarMenu.displayName = "SidebarMenu";

// Sidebar Menu Item
const SidebarMenuItem = React.forwardRef<
  HTMLLIElement,
  React.HTMLAttributes<HTMLLIElement>
>(({ className, ...props }, ref) => (
  <li ref={ref} className={cn("", className)} {...props} />
));
SidebarMenuItem.displayName = "SidebarMenuItem";

// Sidebar Menu Button variants
const sidebarMenuButtonVariants = cva(
  "w-full flex items-center gap-3 px-3 py-2 text-sm font-medium transition-colors rounded-sm",
  {
    variants: {
      variant: {
        default: "hover:bg-black hover:text-white",
        active: "bg-black text-white",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

// Sidebar Menu Button
interface SidebarMenuButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
  VariantProps<typeof sidebarMenuButtonVariants> {
  asChild?: boolean;
}

const SidebarMenuButton = React.forwardRef<
  HTMLButtonElement,
  SidebarMenuButtonProps
>(({ className, variant, asChild = false, ...props }, ref) => {
  const { isOpen } = React.useContext(SidebarContext);

  if (asChild && React.isValidElement(props.children)) {
    return React.cloneElement(props.children as React.ReactElement<any>, {
      ref,
      className: cn(
        sidebarMenuButtonVariants({ variant }),
        !isOpen && "justify-center px-2",
        (props.children as React.ReactElement<any>).props.className,
        className
      ),
    });
  }

  return (
    <button
      ref={ref}
      className={cn(
        sidebarMenuButtonVariants({ variant }),
        !isOpen && "justify-center px-2",
        className
      )}
      {...props}
    >
      {props.children}
    </button>
  );
});
SidebarMenuButton.displayName = "SidebarMenuButton";

// Sidebar Group
const SidebarGroup = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("py-2", className)} {...props} />
));
SidebarGroup.displayName = "SidebarGroup";

// Sidebar Group Label
const SidebarGroupLabel = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  const { isOpen } = React.useContext(SidebarContext);

  return (
    <div
      ref={ref}
      className={cn(
        "px-3 py-2 text-xs font-bold uppercase tracking-wider text-gray-500 flex items-center gap-2",
        !isOpen && "justify-center px-0",
        className
      )}
      {...props}
    >
      {!isOpen && <div className="w-4 h-0.5 bg-gray-400 rounded-full" />}
      {isOpen && children}
    </div>
  );
});
SidebarGroupLabel.displayName = "SidebarGroupLabel";

// Sidebar Trigger (toggle button)
export function SidebarTrigger({
  className,
  ...props
}: React.HTMLAttributes<HTMLButtonElement>) {
  const { isOpen, setIsOpen } = React.useContext(SidebarContext);

  return (
    <button
      onClick={() => setIsOpen(!isOpen)}
      className={cn(
        "p-2 hover:bg-black hover:text-white rounded-sm transition-colors",
        className
      )}
      {...props}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={cn("transition-transform", isOpen && "rotate-180")}
      >
        <path d="m15 18-6-6 6-6" />
      </svg>
    </button>
  );
}

export {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
};
