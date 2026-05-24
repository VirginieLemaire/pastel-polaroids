import { ContestStatus, STATUS_COLOR, STATUS_LABEL } from "@/features/contests/contestStatus";

const StatusBadge = ({ status }: { status: ContestStatus }) => (
  <span
    className={`inline-block brutal-border px-2 py-0.5 font-mono text-xs font-bold ${STATUS_COLOR[status]}`}
  >
    {STATUS_LABEL[status]}
  </span>
);

export default StatusBadge;
