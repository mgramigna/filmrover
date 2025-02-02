import { Link } from "@remix-run/react";
import { useHistory } from "./history-provider";
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
  const { logHistory } = useHistory();

  return (
    <Button
      asChild
      variant="secondary"
      className="w-full text-ellipsis whitespace-normal text-center"
      onClick={() => logHistory({ type, id, display: label })}
    >
      <Link to={href}>{label}</Link>
    </Button>
  );
};
