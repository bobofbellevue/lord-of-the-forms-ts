import { useState } from "react";
import { Profile } from "../Profile";
import { FunctionalForm } from "./FunctionalForm";
import { User } from "../types";

export const FunctionalApp = () => {
  const [userProfile, setUserProfile] = useState<User>({
    first: "",
    last: "",
    city: "",
    phone: "",
    email: "",
  });
  return (
    <>
      <h2>Functional</h2>
      <Profile user={userProfile.first ? userProfile : null} />
      <FunctionalForm
        userProfile={userProfile}
        setUserProfile={(user: User) => setUserProfile(user)}
      />
    </>
  );
};
