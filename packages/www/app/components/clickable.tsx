import { Link } from "@remix-run/react";
import { Button } from "./ui/button";

export const ClickableDetail = ({
  href,
  label,
  type: _type,
  id: _id,
}: {
  href: string;
  label: string;
  type: "movie" | "person";
  id: number;
}) => {
  return (
    <Button
      asChild
      className="w-full text-ellipsis whitespace-normal text-center"
    >
      <Link to={href}>{label}</Link>
    </Button>
  );
};
