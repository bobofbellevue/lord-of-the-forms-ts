import { useState } from "react";
import { FunctionalForm } from "./FunctionalForm";
import { User } from "../types";
import { Profile } from "../Profile";

export const FunctionalApp = () => {
  const [userProfile, setUserProfile] = useState<User | null>(null);
  return (
    <>
      <h2>Functional</h2>
      <Profile user={userProfile} />
      <FunctionalForm
        setUserProfile={(user: User) => setUserProfile(user)}
      />
    </>
  );
};
