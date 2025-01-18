import { Link } from "@remix-run/react";
import { Button } from "./ui/button";

export const ClickableDetail = ({
  href,
  label,
  type,
  id,
}: {
  href: string;
  label: string;
  type: "movie" | "person";
  id: number;
}) => {
  return (
    <Button asChild className="w-full">
      <Link to={href}>{label}</Link>
    </Button>
  );
};
