"use client"

import * as React from "react"
import { Select as BaseSelect } from "@base-ui/react"
import { ChevronDown, Check } from "lucide-react"
import { cn } from "@/client/utils/utils"

interface SelectProps {
  label?: string;
  value?: string;
  onChange?: (e: { target: { value: string } }) => void;
  children: React.ReactNode;
  containerClassName?: string;
  className?: string;
  placeholder?: string;
}

interface SelectChildProps {
  value?: string;
  children?: React.ReactNode;
}

const isSelectChild = (child: React.ReactNode): child is React.ReactElement<SelectChildProps> => {
  return React.isValidElement<SelectChildProps>(child);
};

const Select = ({ 
  label, 
  value, 
  onChange, 
  children, 
  containerClassName, 
  className,
  placeholder = "Select an option..." 
}: SelectProps) => {
  const handleValueChange = (val: string | null) => {
    if (onChange && val !== null) {
      onChange({ target: { value: val } });
    }
  };

  // Manual mapping: Find the display label based on the value to ensure ID is not shown
  const selectedLabel = React.useMemo(() => {
    const childrenArray = React.Children.toArray(children);
    const selectedItem = childrenArray.find(
      (child) => isSelectChild(child) && child.props.value === value
    );
    return isSelectChild(selectedItem)
      ? selectedItem.props.children
      : null;
  }, [children, value]);

  return (
    <div className={cn("relative flex flex-col gap-1.5", containerClassName)}>
      {label && (
        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1.5 mb-0.5 italic">
          {label}
        </label>
      )}
      
      <BaseSelect.Root value={value} onValueChange={handleValueChange}>
        <BaseSelect.Trigger
          className={cn(
            "flex h-10 w-full items-center justify-between rounded-xl border border-zinc-800 bg-zinc-950/50 px-4 py-2 text-xs font-bold text-zinc-200 shadow-xl transition-all duration-300 focus:border-primary/50 focus:outline-none focus:ring-4 focus:ring-primary/10 hover:bg-zinc-900 hover:border-zinc-700 group",
            className
          )}
        >
          <div className="max-w-[calc(100%-24px)] truncate mr-2">
            <BaseSelect.Value placeholder={placeholder}>
              {selectedLabel}
            </BaseSelect.Value>
          </div>
          <div className="flex-shrink-0 flex items-center justify-center w-5 h-5 rounded-lg bg-zinc-900/50 border border-zinc-800 group-hover:border-zinc-700 transition-colors group-data-[popup-open]:border-primary/30">
            <ChevronDown className="h-3 w-3 text-zinc-500 transition-transform duration-300 group-data-[popup-open]:rotate-180 group-data-[popup-open]:text-primary" />
          </div>
        </BaseSelect.Trigger>

        <BaseSelect.Portal>
          <BaseSelect.Positioner sideOffset={6} className="z-50">
            <BaseSelect.Popup
              className="min-w-[var(--shared-rect-width)] overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950/90 p-1.5 text-zinc-200 shadow-2xl backdrop-blur-xl animate-in fade-in zoom-in-95 duration-200 focus:outline-none"
            >
              <div className="flex flex-col gap-0.5">
                {children}
              </div>
            </BaseSelect.Popup>
          </BaseSelect.Positioner>
        </BaseSelect.Portal>
      </BaseSelect.Root>
    </div>
  )
}

interface SelectItemProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
  children: React.ReactNode;
}

const SelectItem = React.forwardRef<HTMLDivElement, SelectItemProps>(
  ({ value, children, className, ...props }, ref) => {
    return (
      <BaseSelect.Item
        value={value}
        ref={ref}
        {...props}
        className={cn(
          "relative flex w-full cursor-pointer select-none items-center rounded-lg py-2.5 pl-3 pr-9 text-xs font-medium text-zinc-400 outline-none transition-colors focus:bg-primary/10 focus:text-primary data-[selected]:text-white data-[selected]:font-bold group",
          className
        )}
      >
        <BaseSelect.ItemText>{children}</BaseSelect.ItemText>
        <BaseSelect.ItemIndicator className="absolute right-3 flex h-3.5 w-3.5 items-center justify-center">
          <Check className="h-3.5 w-3.5 text-primary" />
        </BaseSelect.ItemIndicator>
      </BaseSelect.Item>
    )
  }
)
SelectItem.displayName = "SelectItem"

export { Select, SelectItem }
