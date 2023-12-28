import Link from "next/link";

export const ClickableDetail = ({
  href,
  label,
}: {
  href: string;
  label: string;
}) => {
  return (
    <Link href={href}>
      <div className="w-72 rounded-lg bg-slate-700 p-4 hover:bg-slate-800">
        {label}
      </div>
    </Link>
  );
};
