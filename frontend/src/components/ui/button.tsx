import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md border font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#83d5bb] focus-visible:ring-offset-2 focus-visible:ring-offset-[#080c10] disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "border-[#37665b] bg-[#193329] text-[#a7dfca] hover:bg-[#23473a]",
        outline: "border-[#34434b] bg-transparent text-[#b2bdc2] hover:border-[#5c8276] hover:text-[#83d5bb]",
        ghost: "border-transparent bg-transparent text-[#b2bdc2] hover:bg-[#16221f] hover:text-[#83d5bb]",
      },
      size: { default: "h-9 px-4 text-xs", sm: "h-9 px-3 text-xs" },
    },
    defaultVariants: { variant: "default", size: "default" },
  },
);

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Component = asChild ? Slot : "button";
    return <Component className={cn(buttonVariants({ variant, size }), className)} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
