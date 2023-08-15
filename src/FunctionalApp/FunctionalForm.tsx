import { useState, useRef } from "react";
import { FunctionalInputName } from "./FunctionalInputName.tsx";
import { User } from "../types";
import { ErrorMessage } from "../ErrorMessage.tsx";
import {
  validateName,
  validateEmail,
  validatePhone,
} from "../utils/validations.ts";

export interface FunctionalFormProps {
  user: User;
  setUser: React.Dispatch<React.SetStateAction<User>>;
}

const FIRST_ERROR = 0;
const LAST_ERROR = 1;
const CITY_ERROR = 2;
const EMAIL_ERROR = 3;
const PHONE_ERROR = 4;

const onChangePhoneSegment = (
  e: React.ChangeEvent<HTMLInputElement>,
  pos: number,
  max: number,
  nextMax: number,
  submitted: boolean,
  user: User,
  setUser: React.Dispatch<React.SetStateAction<User>>,
  phoneSegments: string[],
  setPhoneSegments: React.Dispatch<React.SetStateAction<string[]>>,
  errors: string[],
  setErrors: React.Dispatch<React.SetStateAction<string[]>>,
  phoneSegmentRefs: React.RefObject<HTMLInputElement>[]
) => {
  // strip out non-digit characters
  const value = e.target.value.replace(/[^0-9]/g, "");
  let phoneSegment = value;
  let phoneExcess = "";
  // strip out characters that exceed field length
  if (phoneSegment.length > max) {
    phoneExcess = phoneSegment.slice(max, max + 1);
    phoneSegment = phoneSegment.slice(0, max);
  }
  const tempPhoneSegments = phoneSegments.slice();
  tempPhoneSegments[pos] = phoneSegment;
  // excess character can be bumped along to next field if empty
  if (
    pos < 3 &&
    phoneExcess.length === 1 &&
    tempPhoneSegments[pos + 1].length === 0
  ) {
    tempPhoneSegments[pos + 1] = phoneExcess;
  }
  // determine if we are going backwards - deleting characters - whether by backspace, delete key, or overtyping
  const backwards =
    tempPhoneSegments.join("").length < phoneSegments.join("").length;
  setPhoneSegments(tempPhoneSegments);
  const phone = tempPhoneSegments.join("");
  const phoneError = validatePhone("Phone", phone, submitted);
  const newErrors = errors;
  newErrors[PHONE_ERROR] = phoneError;
  setErrors(newErrors);
  // if phone number is complete, update state in user object
  if (phone.length === 7 && !phoneError) {
    setUser({ ...user, phone: phone });
  }
  // jump to next or previous field and set focus to end of content, in two cases:
  // 1. going forwards if current field is full and there is a next field
  // 2. going backwards if current field is empty and there is a previous field
  if (
    (pos < 3 && phoneSegment.length == max && nextMax > 0) ||
    (pos > 0 && backwards && phoneSegment.length === 0)
  ) {
    const newPos = pos + (backwards ? -1 : 1);
    const obj = phoneSegmentRefs[newPos].current;
    if (obj) {
      obj.focus();
      if (!backwards && nextMax == tempPhoneSegments[newPos].length) {
        // highlight existing text if it fills up the field
        obj.selectionStart = 0;
        obj.selectionEnd = tempPhoneSegments[newPos].length;
      } else {
        // set caret to end of text
        obj.selectionStart = tempPhoneSegments[newPos].length;
        obj.selectionEnd = tempPhoneSegments[newPos].length;
      }
    }
  }
};

const onKeyUpPhone = (
  key: React.Key,
  pos: number,
  phoneSegmentRefs: React.RefObject<HTMLInputElement>[],
  phoneSegments: string[]
) => {
  // jump to field and set focus to end of content, if hitting backspace in an empty field (onChange would not be triggered)
  if (key === "Backspace" && phoneSegments[pos].length === 0 && pos > 0) {
    const obj = phoneSegmentRefs[pos - 1].current;
    if (obj) {
      obj.focus();
      obj.selectionStart = phoneSegments[pos - 1].length;
      obj.selectionEnd = phoneSegments[pos - 1].length;
    }
  }
};

const onSubmitForm = (
  e: React.FormEvent<HTMLFormElement>,
  setSubmitted: React.Dispatch<React.SetStateAction<boolean>>,
  user: User,
  setUser: React.Dispatch<React.SetStateAction<User>>,
  phoneSegments: string[],
  errors: string[],
  setErrors: React.Dispatch<React.SetStateAction<string[]>>
) => {
  e.preventDefault();
  setSubmitted(true);

  // validate each field because some errors were ignored before submitting - may only be caught now
  const firstError = validateName("First name", user.first, true);
  const lastError = validateName("Last name", user.last, true);
  const cityError = validateName("City", user.city, true);
  const emailError = validateEmail(user.email, true);
  const phone = phoneSegments.join("");
  const phoneError = validatePhone("Phone", phone, true);
  const newErrors = errors;
  newErrors[FIRST_ERROR] = firstError;
  newErrors[LAST_ERROR] = lastError;
  newErrors[CITY_ERROR] = cityError;
  newErrors[PHONE_ERROR] = phoneError;
  newErrors[EMAIL_ERROR] = emailError;
  setErrors(newErrors);

  // if no errors found, set state in parent class
  if (newErrors.join("").length === 0) {
    setUser({ ...user, phone: phone });
  }
};

const onChangeName = (
  e: React.ChangeEvent<HTMLInputElement>,
  user: User,
  setUser: React.Dispatch<React.SetStateAction<User>>,
  fieldName: string,
  propertyType: string,
  errorType: number,
  errors: string[],
  setErrors: React.Dispatch<React.SetStateAction<string[]>>,
  submitted: boolean
) => {
  const newErrors = errors;
  const errorMessage = validateName(fieldName, e.target.value, submitted);
  newErrors[errorType] = errorMessage;
  setErrors(newErrors);
  setUser({ ...user, [propertyType]: e.target.value });
};

const onChangeEmail = (
  e: React.ChangeEvent<HTMLInputElement>,
  user: User,
  setUser: React.Dispatch<React.SetStateAction<User>>,
  errors: string[],
  setErrors: React.Dispatch<React.SetStateAction<string[]>>,
  submitted: boolean
) => {
  const newErrors = errors;
  const errorMessage = validateEmail(e.target.value, submitted);
  newErrors[EMAIL_ERROR] = errorMessage;
  setErrors(newErrors);
  setUser({ ...user, email: e.target.value });
};

export const FunctionalForm = (props: FunctionalFormProps) => {
  const [user, setUser] = useState(props.user);
  const [errors, setErrors] = useState(["", "", "", "", ""]);
  const [submitted, setSubmitted] = useState(false);
  const [phoneSegments, setPhoneSegments] = useState(["", "", "", ""]);
  const phoneSegmentRefs: React.RefObject<HTMLInputElement>[] = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  return (
    <form
      onSubmit={(e) =>
        onSubmitForm(
          e,
          setSubmitted,
          user,
          props.setUser,
          phoneSegments,
          errors,
          setErrors
        )
      }
    >
      <u>
        <h3>User Information Form</h3>
      </u>

      <FunctionalInputName
        label={"First Name"}
        error={errors[FIRST_ERROR]}
        onChange={(e) =>
          onChangeName(
            e,
            user,
            setUser,
            "First name",
            "first",
            FIRST_ERROR,
            errors,
            setErrors,
            submitted
          )
        }
        value={user.first}
      />

      <FunctionalInputName
        label={"Last Name"}
        error={errors[LAST_ERROR]}
        onChange={(e) =>
          onChangeName(
            e,
            user,
            setUser,
            "Last name",
            "last",
            LAST_ERROR,
            errors,
            setErrors,
            submitted
          )
        }
        value={user.last}
      />

      <FunctionalInputName
        label={"City"}
        error={errors[CITY_ERROR]}
        onChange={(e) =>
          onChangeName(
            e,
            user,
            setUser,
            "City",
            "city",
            CITY_ERROR,
            errors,
            setErrors,
            submitted
          )
        }
        value={user.city}
        list="cities"
      />

      <div className="input-wrap">
        <label htmlFor="phone">Phone:</label>
        <div id="phone-input-wrap">
          <input
            type="text"
            ref={phoneSegmentRefs[0]}
            onChange={(e) =>
              onChangePhoneSegment(
                e,
                0,
                2,
                2,
                submitted,
                user,
                setUser,
                phoneSegments,
                setPhoneSegments,
                errors,
                setErrors,
                phoneSegmentRefs
              )
            }
            id="phone-input-1"
            value={phoneSegments[0]}
          />
          -
          <input
            type="text"
            ref={phoneSegmentRefs[1]}
            onChange={(e) =>
              onChangePhoneSegment(
                e,
                1,
                2,
                2,
                submitted,
                user,
                setUser,
                phoneSegments,
                setPhoneSegments,
                errors,
                setErrors,
                phoneSegmentRefs
              )
            }
            onKeyUp={(e) =>
              onKeyUpPhone(e.key, 1, phoneSegmentRefs, phoneSegments)
            }
            id="phone-input-2"
            value={phoneSegments[1]}
          />
          -
          <input
            type="text"
            ref={phoneSegmentRefs[2]}
            onChange={(e) =>
              onChangePhoneSegment(
                e,
                2,
                2,
                1,
                submitted,
                user,
                setUser,
                phoneSegments,
                setPhoneSegments,
                errors,
                setErrors,
                phoneSegmentRefs
              )
            }
            onKeyUp={(e) =>
              onKeyUpPhone(e.key, 2, phoneSegmentRefs, phoneSegments)
            }
            id="phone-input-3"
            value={phoneSegments[2]}
          />
          -
          <input
            type="text"
            ref={phoneSegmentRefs[3]}
            onChange={(e) =>
              onChangePhoneSegment(
                e,
                3,
                1,
                0,
                submitted,
                user,
                setUser,
                phoneSegments,
                setPhoneSegments,
                errors,
                setErrors,
                phoneSegmentRefs
              )
            }
            onKeyUp={(e) =>
              onKeyUpPhone(e.key, 3, phoneSegmentRefs, phoneSegments)
            }
            id="phone-input-4"
            value={phoneSegments[3]}
          />
        </div>
      </div>
      <ErrorMessage
        message={errors[PHONE_ERROR]}
        show={errors[PHONE_ERROR].length > 0}
      />

      <FunctionalInputName
        label={"Email"}
        error={errors[EMAIL_ERROR]}
        onChange={(e) =>
          onChangeEmail(e, user, setUser, errors, setErrors, submitted)
        }
        value={user.email}
      />

      <input type="submit" value="Submit" />
    </form>
  );
};
