import User from "@models/user";
import { Profile } from "passport";

export async function createUserFromGoogle(profile: Profile) {
  const user = await User.create({
    email: profile.emails?.[0]?.value ?? null,
  });
  return user;
}
