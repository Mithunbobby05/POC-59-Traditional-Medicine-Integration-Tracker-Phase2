import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva("inline-flex items-center rounded-full border px-2 py-1 text-xs font-medium tracking-wide", {
  variants: {
    variant: {
      default: "border-[#31554a] bg-[#193329] text-[#a7dfca]",
      outline: "border-[#34434b] bg-transparent text-[#9ba8ae]",
      warning: "border-[#5b503a] bg-[#282216] text-[#dfbf80]",
    },
  },
  defaultVariants: { variant: "default" },
});

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
