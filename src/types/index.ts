export interface Room {
  id: string;
  owner: Owner;
  users: Users;
  videos: Record<string, string>
}

export interface User {
  id: string;
  name: string;

}
export type Users = Record<string, User>

export interface Owner {
  name: string;
  ownerSlug: string;
}
