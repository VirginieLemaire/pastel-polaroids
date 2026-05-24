export type { Contest, CreateContestInput, ContestContextValue } from "./types";
export { ContestProvider, DEV_SCENARIO_CHANGE_EVENT } from "./ContestContext";
export { STATUS_LABEL, STATUS_COLOR } from "./contestStatus"
export { useContests } from "./useContests";
export { canEditContest } from "./permissions";

export const DAY = 24 * 60 * 60 * 1000;