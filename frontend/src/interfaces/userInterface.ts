import { AccountType } from "./authInterfaces";
import { IResponseInterface } from "./responseInterface";

export interface IUserInterface extends IResponseInterface {
  id: string;
  username: string;
  email: string;
  accountType: AccountType;
}
