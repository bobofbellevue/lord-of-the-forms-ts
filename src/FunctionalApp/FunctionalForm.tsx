import { useState, FormEvent } from "react";
import { FunctionalInputName } from "./FunctionalInputName.tsx";
import { User, ErrorMessages } from "../types";
import {
  validateName,
  validateEmail,
  validatePhone,
} from "../utils/validations.ts";
import { FunctionalInputPhone } from "./FunctionalInputPhone.tsx";

export interface FunctionalFormProps {
  userProfile: User;
  setUserProfile(user: User): void;
}

export const FunctionalForm = (props: FunctionalFormProps) => {
  const [user, setUser] = useState<User>({
    first: "",
    last: "",
    city: "",
    phone: "",
    email: "",
  });
  const [errors, setErrors] = useState<ErrorMessages>({
    first: "",
    last: "",
    city: "",
    email: "",
    phone: "",
  });
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [phoneSegments, setPhoneSegments] = useState<string[]>([
    "",
    "",
    "",
    "",
  ]);

  const setNameState = (fieldName: string, name: string, error: string) => {
    setUser({ ...user, [fieldName]: name });
    setErrors({ ...errors, [fieldName]: error });
  };

  const setEmailState = (email: string, error: string) => {
    setUser({ ...user, email: email });
    setErrors({ ...errors, email: error });
  };

  const setPhoneState = (
    phone: string,
    phoneSegments: string[],
    phoneError: string
  ) => {
    // if phone number is complete, update state in user object
    if (phone.length === 7 && !phoneError) {
      setUser({ ...user, phone: phone });
    }
    setErrors({ ...errors, phone: phoneError });
    setPhoneSegments(phoneSegments);
  };

  const onSubmitForm = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);

    // validate each field because some errors were ignored before submitting - may only be caught now
    const newErrors = { first: "", last: "", email: "", city: "", phone: "" };
    newErrors["first"] = validateName("First name", user.first, true);
    newErrors["last"] = validateName("Last name", user.last, true);
    newErrors["city"] = validateName("City", user.city, true);
    newErrors["email"] = validateEmail(user.email, true);
    const phone = phoneSegments.join("");
    newErrors["phone"] = validatePhone("Phone", phone, true);
    setErrors(newErrors);

    // if no errors found, set state in parent component
    if (
      Object.entries(newErrors).find((keyvalue) => keyvalue[1].length > 0) ==
      undefined
    ) {
      props.setUserProfile(user);
    }
  };

  return (
    <form onSubmit={(e) => onSubmitForm(e)}>
      <u>
        <h3>User Information Form</h3>
      </u>

      <FunctionalInputName
        label={"First Name"}
        value={user.first}
        fieldName={"first"}
        submitted={submitted}
        setNameState={(fieldName, name, error) =>
          setNameState(fieldName, name, error)
        }
        errorMessage={errors["first"]}
      />

      <FunctionalInputName
        label={"Last Name"}
        value={user.last}
        fieldName={"last"}
        submitted={submitted}
        setNameState={(fieldName, name, error) =>
          setNameState(fieldName, name, error)
        }
        errorMessage={errors["last"]}
      />

      <FunctionalInputName
        label={"City"}
        value={user.city}
        fieldName={"city"}
        submitted={submitted}
        setNameState={(fieldName, name, error) =>
          setNameState(fieldName, name, error)
        }
        errorMessage={errors["city"]}
        list={"cities"}
      />

      <FunctionalInputPhone
        phoneSegments={phoneSegments}
        submitted={submitted}
        setPhoneState={(phone, phoneSegments, phoneError) =>
          setPhoneState(phone, phoneSegments, phoneError)
        }
        errorMessage={errors["phone"]}
      />

      <FunctionalInputName
        label={"Email"}
        value={user.email}
        fieldName={"email"}
        submitted={submitted}
        setEmailState={(email, error) => setEmailState(email, error)}
        errorMessage={errors["email"]}
      />

      <input type="submit" value="Submit" />
    </form>
  );
};
