import { signIn } from "@/api/authApi";
import { ICredentials } from "@/interfaces/authInterfaces";

const useAuth = () => {
  const handleSignIn = async (credentials: ICredentials) => {
    signIn(credentials);
    //TODO Left for tomorrow
  };

  return { handleSignIn };
};

export default useAuth;
