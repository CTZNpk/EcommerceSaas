import { ICredentials, IUserDetails } from "@/interfaces/authInterfaces";
import apiClient from "./apiClient";

export const signIn = async (credentials: ICredentials) => {
  const response = await apiClient.post("/users/signin", credentials);
  return response.data;
};

export const signUp = async (userDetails: IUserDetails) => {
  const response = await apiClient.post("/users/register", userDetails);
  return response.data;
};
