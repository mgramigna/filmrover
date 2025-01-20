import { Link } from "@remix-run/react";
import { Button } from "./ui/button";
import { useHistory } from "./history-provider";

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
  const { logHistory } = useHistory();

  return (
    <Button
      asChild
      className="w-full text-ellipsis whitespace-normal text-center"
      onClick={() => logHistory({ type, id, display: label })}
    >
      <Link to={href}>{label}</Link>
    </Button>
  );
};
