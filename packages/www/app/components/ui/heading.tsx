import { cn } from "@/lib/utils";
import { type VariantProps, cva } from "class-variance-authority";
import { match } from "ts-pattern";

export const headingVariants = cva("", {
  variants: {
    variant: {
      h1: "font-extrabold text-4xl tracking-tight",
      h2: "font-semibold text-3xl tracking-tight",
      h3: "font-semibold text-2xl",
      h4: "font-semibold text-xl",
      h5: "font-semibold text-lg",
      h6: "font-semibold text-base",
    },
  },
  defaultVariants: {
    variant: "h1",
  },
});

type HeadingVariants = VariantProps<typeof headingVariants>;
type Variant = NonNullable<HeadingVariants["variant"]>;

export interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  variant: Variant;
}

export const Heading = ({
  variant,
  className,
  children,
  ...rest
}: HeadingProps) => {
  return match(variant)
    .with("h1", () => (
      <h1
        className={cn(
          headingVariants({
            className,
            variant,
          }),
        )}
        {...rest}
      >
        {children}
      </h1>
    ))
    .with("h2", () => (
      <h2
        className={cn(
          headingVariants({
            className,
            variant,
          }),
        )}
        {...rest}
      >
        {children}
      </h2>
    ))
    .with("h3", () => (
      <h3
        className={cn(
          headingVariants({
            className,
            variant,
          }),
        )}
        {...rest}
      >
        {children}
      </h3>
    ))
    .with("h4", () => (
      <h4
        className={cn(
          headingVariants({
            className,
            variant,
          }),
          { ...rest },
        )}
      >
        {children}
      </h4>
    ))
    .with("h5", () => (
      <h5
        className={cn(
          headingVariants({
            className,
            variant,
          }),
          { ...rest },
        )}
      >
        {children}
      </h5>
    ))
    .with("h6", () => (
      <h6
        className={cn(
          headingVariants({
            className,
            variant,
          }),
          { ...rest },
        )}
      >
        {children}
      </h6>
    ))
    .exhaustive();
};
