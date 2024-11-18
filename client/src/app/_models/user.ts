export class User {
  username!: string;
  alias!: string;
  roles: Role[] = [];
}

export enum Role {
  Admin = "Admin"
}

export class UserToken {
  username!: string;
  alias?: string;
  roles?: Role[];
  token?: string;
  expiresIn?: number;
}
