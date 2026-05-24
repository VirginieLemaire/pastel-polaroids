import type { User } from "./types";
import { getAvatarDataUri } from "@/shared/utils/getAvatarUri";


export const CURRENT_USER: User = {
  id: "user-1",
  name: "Camille",
  email: "camille@famille.test",
};

export const USERS: User[] = [
  {
    id: "user-1",
    name: "Camille",
    email: "camille@famille.test",
  },
  {
    id: "user-other",
    name: "Bob",
    email: "bobdilane@famille.test"
  }
];