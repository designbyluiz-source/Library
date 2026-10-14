import * as React from "react";
import * as Primitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "../../lib/utils";
export const Dialog = Primitive.Root;
export const DialogTrigger = Primitive.Trigger;
export const DialogClose = Primitive.Close;
export const DialogTitle = Primitive.Title;
export const DialogDescription = Primitive.Description;
export const DialogContent = React.forwardRef<
  React.ElementRef<typeof Primitive.Content>,
  React.ComponentPropsWithoutRef<typeof Primitive.Content> & {
    closeLabel?: string;
  }
>(
  (
    {
      className,
      children,
      closeLabel = "Close day events",
      onEscapeKeyDown,
      ...props
    },
    ref,
  ) => (
    <Primitive.Portal>
      <Primitive.Overlay className="dialog-overlay" />
      <Primitive.Content
        ref={ref}
        className={cn("dialog-content", className)}
        onEscapeKeyDown={(event) => {
          event.stopPropagation();
          onEscapeKeyDown?.(event);
        }}
        {...props}
      >
        {children}
        <Primitive.Close className="dialog-close" aria-label={closeLabel}>
          <X size={18} aria-hidden="true" />
        </Primitive.Close>
      </Primitive.Content>
    </Primitive.Portal>
  ),
);
DialogContent.displayName = "DialogContent";
