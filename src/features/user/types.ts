export interface User {
  id: string;
  name: string;
  email: string;
  avatarSeed: string;
}

export interface UserContextValue {
  currentUser: User;
}
