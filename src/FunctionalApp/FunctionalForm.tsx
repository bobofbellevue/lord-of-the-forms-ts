import { useState, FormEvent } from "react";
import { FunctionalInputName } from "./FunctionalInputName.tsx";
import { User, ErrorType, FunctionalStateType } from "../types";
import {
  validateName,
  validateEmail,
  validatePhone,
} from "../utils/validations.ts";
import { FunctionalInputPhone } from "./FunctionalInputPhone.tsx";

const onSubmitForm = (
  e: FormEvent<HTMLFormElement>,
  state: FunctionalStateType
) => {
  e.preventDefault();
  state.setSubmitted(true);

  // validate each field because some errors were ignored before submitting - may only be caught now
  const firstError = validateName("First name", state.userStaging.first, true);
  const lastError = validateName("Last name", state.userStaging.last, true);
  const cityError = validateName("City", state.userStaging.city, true);
  const emailError = validateEmail(state.userStaging.email, true);
  const phone = state.phoneSegments.join("");
  const phoneError = validatePhone("Phone", phone, true);
  const newErrors = state.errors;
  newErrors[ErrorType.FirstName] = firstError;
  newErrors[ErrorType.LastName] = lastError;
  newErrors[ErrorType.City] = cityError;
  newErrors[ErrorType.Phone] = phoneError;
  newErrors[ErrorType.Email] = emailError;
  state.setErrors(newErrors);

  // if no errors found, set state in parent class
  if (newErrors.join("").length === 0) {
    state.setUserProfile({ ...state.userStaging });
  }
};

export interface FunctionalFormProps {
  userProfile: User;
  setUserProfile(user: User): void;
}

export const FunctionalForm = (props: FunctionalFormProps) => {
  const [userStaging, setUserStaging] = useState<User>({
    first: "",
    last: "",
    city: "",
    phone: "",
    email: "",
  });
  const [errors, setErrors] = useState<string[]>(["", "", "", "", ""]);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [phoneSegments, setPhoneSegments] = useState<string[]>([
    "",
    "",
    "",
    "",
  ]);

  // Anything the child components might need is collected here
  // Calling it "state" because it is analogous to state
  const state: FunctionalStateType = {
    userProfile: props.userProfile,
    setUserProfile: (user: User) => props.setUserProfile(user),
    userStaging: userStaging,
    setUserStaging: (user: User) => setUserStaging(user),
    errors: errors,
    setErrors: (errors: string[]) => setErrors(errors),
    phoneSegments: phoneSegments,
    setPhoneSegments: (phoneSegments: string[]) =>
      setPhoneSegments(phoneSegments),
    submitted: submitted,
    setSubmitted: (status: boolean) => setSubmitted(status),
  };

  return (
    <form onSubmit={(e) => onSubmitForm(e, state)}>
      <u>
        <h3>User Information Form</h3>
      </u>

      <FunctionalInputName
        label={"First Name"}
        value={userStaging.first}
        errorType={ErrorType.FirstName}
        fieldName={"first"}
        state={state}
      />

      <FunctionalInputName
        label={"Last Name"}
        value={userStaging.last}
        errorType={ErrorType.LastName}
        fieldName={"last"}
        state={state}
      />

      <FunctionalInputName
        label={"City"}
        value={userStaging.city}
        errorType={ErrorType.City}
        fieldName={"city"}
        state={state}
        list={"cities"}
      />

      <FunctionalInputPhone state={state} />

      <FunctionalInputName
        label={"Email"}
        value={userStaging.email}
        errorType={ErrorType.Email}
        fieldName={"email"}
        state={state}
      />

      <input type="submit" value="Submit" />
    </form>
  );
};
