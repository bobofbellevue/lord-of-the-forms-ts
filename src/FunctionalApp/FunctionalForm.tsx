import { useState, FormEvent } from "react";
import { FunctionalInputName } from "./FunctionalInputName.tsx";
import { User } from "../types";
import {
  getNameErrors,
  getEmailErrors,
  getPhoneErrors,
} from "../utils/validations.ts";
import { FunctionalInputPhone } from "./FunctionalInputPhone.tsx";

export type FunctionalFormProps = {
  setUserProfile(user: User): void;
};

export const FunctionalForm = (props: FunctionalFormProps) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [city, setCity] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const onSubmitForm = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // validate each field because some errors were ignored before submitting - may only be caught now
    setSubmitted(true);
    let errors = getNameErrors("First name", firstName, true);
    errors += getNameErrors("Last name", lastName, true);
    errors += getNameErrors("City", city, true);
    errors += getEmailErrors(email, true);
    errors += getPhoneErrors(phone, true);

    // if no errors found, set state in parent component
    if (errors === "") {
      props.setUserProfile({
        firstName: firstName,
        lastName: lastName,
        city: city,
        phone: phone,
        email: email,
      });
    }
  };

  const firstNameErrors = getNameErrors("First name", firstName, submitted);
  const lastNameErrors = getNameErrors("Last name", lastName, submitted);
  const cityErrors = getNameErrors("City", city, submitted);
  const emailErrors = getEmailErrors(email, submitted);
  const phoneErrors = getPhoneErrors(phone, submitted);
  return (
    <form onSubmit={(e) => onSubmitForm(e)}>
      <u>
        <h3>User Information Form</h3>
      </u>

      <FunctionalInputName
        label={"First Name"}
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
        errors={firstNameErrors}
      />

      <FunctionalInputName
        label={"Last Name"}
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
        errors={lastNameErrors}
      />

      <FunctionalInputName
        label={"City"}
        value={city}
        onChange={(e) => setCity(e.target.value)}
        errors={cityErrors}
        list={"cities"}
      />

      <FunctionalInputPhone
        label={"Phone"}
        value={phone}
        setPhoneState={(value) => setPhone(value)}
        errors={phoneErrors}
      />

      <FunctionalInputName
        label={"Email"}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        errors={emailErrors}
      />

      <input type="submit" value="Submit" />
    </form>
  );
};
