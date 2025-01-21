import { Loader2 } from "lucide-react";

import { Button, type ButtonProps } from "@/components/ui/button";

type LoaderButtonProps = ButtonProps & {
  isLoading: boolean;
};

export const LoaderButton = ({
  isLoading,
  disabled,
  children,
  ...rest
}: LoaderButtonProps) => {
  return (
    <Button {...rest} disabled={disabled || isLoading}>
      {isLoading && <Loader2 className="animate-spin" />}
      {children}
    </Button>
  );
};
