import { useState } from "react";
import { FunctionalForm } from "./FunctionalForm";
import { User } from "../types";
import { Profile } from "../Profile";

export const FunctionalApp = () => {
  const [userProfile, setUserProfile] = useState<User>({
    firstName: "",
    lastName: "",
    city: "",
    phone: "",
    email: "",
  });
  return (
    <>
      <h2>Functional</h2>
      <Profile user={userProfile.firstName ? userProfile : null} />
      <FunctionalForm
        userProfile={userProfile}
        setUserProfile={(user: User) => setUserProfile(user)}
      />
    </>
  );
};
