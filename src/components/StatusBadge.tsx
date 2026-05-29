import { ContestStatus, STATUS_COLOR, STATUS_LABEL } from "@/features/contests";
import { colorClass } from "@/shared/ui";

export default function StatusBadge({ status }: { status: ContestStatus }) {
  const color = STATUS_COLOR[status];
  
  return (
    <span
      className={`inline-block brutal-border px-2 py-0.5 font-mono text-xs font-bold ${colorClass[color]}`}
    >
      {STATUS_LABEL[status]}
    </span>  
  );
}
