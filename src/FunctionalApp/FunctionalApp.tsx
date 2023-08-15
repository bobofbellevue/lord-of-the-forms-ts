import { useState } from "react";
import { Profile } from "../Profile";
import { FunctionalForm } from "./FunctionalForm";

export const FunctionalApp = () => {
  const [user, setUser] = useState({
    first: "",
    last: "",
    city: "",
    phone: "",
    email: "",
  });
  return (
    <>
      <h2>Functional</h2>
      <Profile user={user} />
      <FunctionalForm user={user} setUser={setUser} />
    </>
  );
};
