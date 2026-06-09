import * as React from "react";
import { type VariantProps } from "class-variance-authority";
import { Separator } from "@/components/ui/separator";
declare function ItemGroup({ className, ...props }: React.ComponentProps<"div">): React.JSX.Element;
declare function ItemSeparator({ className, ...props }: React.ComponentProps<typeof Separator>): React.JSX.Element;
declare const itemVariants: (props?: ({
    variant?: "default" | "outline" | "muted" | null | undefined;
    size?: "default" | "sm" | null | undefined;
} & import("class-variance-authority/types").ClassProp) | undefined) => string;
declare function Item({ className, variant, size, asChild, ...props }: React.ComponentProps<"div"> & VariantProps<typeof itemVariants> & {
    asChild?: boolean;
}): React.JSX.Element;
declare const itemMediaVariants: (props?: ({
    variant?: "default" | "icon" | "image" | null | undefined;
} & import("class-variance-authority/types").ClassProp) | undefined) => string;
declare function ItemMedia({ className, variant, ...props }: React.ComponentProps<"div"> & VariantProps<typeof itemMediaVariants>): React.JSX.Element;
declare function ItemContent({ className, ...props }: React.ComponentProps<"div">): React.JSX.Element;
declare function ItemTitle({ className, ...props }: React.ComponentProps<"div">): React.JSX.Element;
declare function ItemDescription({ className, ...props }: React.ComponentProps<"p">): React.JSX.Element;
declare function ItemActions({ className, ...props }: React.ComponentProps<"div">): React.JSX.Element;
declare function ItemHeader({ className, ...props }: React.ComponentProps<"div">): React.JSX.Element;
declare function ItemFooter({ className, ...props }: React.ComponentProps<"div">): React.JSX.Element;
export { Item, ItemMedia, ItemContent, ItemActions, ItemGroup, ItemSeparator, ItemTitle, ItemDescription, ItemHeader, ItemFooter, };
//# sourceMappingURL=item.d.ts.map