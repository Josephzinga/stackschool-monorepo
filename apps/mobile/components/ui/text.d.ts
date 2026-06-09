import { type VariantProps } from 'class-variance-authority';
import * as React from 'react';
import { Text as RNText } from 'react-native';
declare const textVariants: (props?: ({
    variant?: "small" | "default" | "code" | "blockquote" | "h1" | "h2" | "h3" | "h4" | "p" | "large" | "lead" | "muted" | null | undefined;
} & import("class-variance-authority/types").ClassProp) | undefined) => string;
type TextVariantProps = VariantProps<typeof textVariants>;
declare const TextClassContext: React.Context<string | undefined>;
declare function Text({ className, asChild, variant, ...props }: React.ComponentProps<typeof RNText> & TextVariantProps & React.RefAttributes<RNText> & {
    asChild?: boolean;
}): React.JSX.Element;
export { Text, TextClassContext };
//# sourceMappingURL=text.d.ts.map