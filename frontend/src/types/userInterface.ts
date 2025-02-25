import { AccountType } from "./accountEnum";

export interface IUser {
  id: string;
  username: string;
  email: string;
  accountType: AccountType;
  imageUrl: string;
  phoneNumber: string;
  address: string;
}
