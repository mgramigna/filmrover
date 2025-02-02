import { cn } from "@/lib/utils";
import { type VariantProps, cva } from "class-variance-authority";
import { match } from "ts-pattern";

export const headingVariants = cva("", {
  variants: {
    variant: {
      h1: "font-extrabold text-4xl md:text-6xl tracking-tight",
      h2: "font-bold text-3xl md:text-5xl tracking-tight",
      h3: "font-semibold text-2xl md:text-4xl tracking-tight",
      h4: "font-medium text-xl md:text-3xl",
      h5: "font-medium text-lg md:text-2xl",
      h6: "font-medium text-base md:text-xl",
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
