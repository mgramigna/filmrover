import { useRouter } from "next/navigation";

import { useHistory } from "@/context/HistoryContext";

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
  const router = useRouter();
  const { logHistory } = useHistory();

  return (
    <button
      onClick={() => {
        logHistory({
          type,
          id,
          display: label,
        });

        router.push(href);
      }}
      className="w-72 rounded-lg bg-slate-700 p-4 hover:bg-slate-800"
    >
      {label}
    </button>
  );
};
