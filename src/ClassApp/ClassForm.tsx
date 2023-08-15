import { Component, createRef, FormEvent } from "react";
import {
  validateEmail,
  validateName,
  validatePhone,
} from "../utils/validations.ts";
import { ClassInputName } from "./ClassInputName.tsx";
import { User } from "../types";
import { ErrorMessage } from "../ErrorMessage.tsx";

export interface ClassFormProps {
  user: User;
  setUser(user: User): void;
}

const FIRST_ERROR = 0;
const LAST_ERROR = 1;
const CITY_ERROR = 2;
const EMAIL_ERROR = 3;
const PHONE_ERROR = 4;

export class ClassForm extends Component<ClassFormProps> {
  state = {
    user: this.props.user,
    errors: ["", "", "", "", ""],
    submitted: false,
    phoneSegments: ["", "", "", ""],
  };

  phoneSegmentRefs: React.RefObject<HTMLInputElement>[] = [
    createRef<HTMLInputElement>(),
    createRef<HTMLInputElement>(),
    createRef<HTMLInputElement>(),
    createRef<HTMLInputElement>(),
  ];

  onChangePhoneSegment(
    e: React.ChangeEvent<HTMLInputElement>,
    pos: number,
    max: number,
    nextMax: number
  ) {
    // strip out non-digit characters
    const value = e.target.value.replace(/[^0-9]/g, "");
    let phoneSegment = value;
    let phoneExcess = "";
    // strip out characters that exceed field length
    if (phoneSegment.length > max) {
      phoneExcess = phoneSegment.slice(max, max + 1);
      phoneSegment = phoneSegment.slice(0, max);
    }
    const tempPhoneSegments = this.state.phoneSegments.slice();
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
      tempPhoneSegments.join("").length <
      this.state.phoneSegments.join("").length;
    this.setState({ phoneSegments: tempPhoneSegments });
    const phone = tempPhoneSegments.join("");
    const phoneError = validatePhone("Phone", phone, this.state.submitted);
    const newErrors = this.state.errors;
    newErrors[PHONE_ERROR] = phoneError;
    this.setState({ errors: newErrors });
    // if phone number is complete, update state in user object
    if (phone.length === 7 && !phoneError) {
      this.setState({ user: { ...this.state.user, phone: phone } });
    }
    // jump to next or previous field and set focus to end of content, in two cases:
    // 1. going forwards if current field is full and there is a next field
    // 2. going backwards if current field is empty and there is a previous field
    if (
      (pos < 3 && phoneSegment.length == max && nextMax > 0) ||
      (pos > 0 && backwards && phoneSegment.length === 0)
    ) {
      const newPos = pos + (backwards ? -1 : 1);
      const obj = this.phoneSegmentRefs[newPos].current;
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
  }

  onKeyUpPhone(key: React.Key, pos: number) {
    // jump to field and set focus to end of content, if hitting backspace in an empty field (onChange would not be triggered)
    if (
      key === "Backspace" &&
      this.state.phoneSegments[pos].length === 0 &&
      pos > 0
    ) {
      const obj = this.phoneSegmentRefs[pos - 1].current;
      if (obj) {
        obj.focus();
        obj.selectionStart = this.state.phoneSegments[pos - 1].length;
        obj.selectionEnd = this.state.phoneSegments[pos - 1].length;
      }
    }
  }

  onSubmitForm = (e: FormEvent) => {
    e.preventDefault();
    this.setState({ submitted: true });

    // validate each field because some errors were ignored before submitting - may only be caught now
    const firstError = validateName("First name", this.state.user.first, true);
    const lastError = validateName("Last name", this.state.user.last, true);
    const cityError = validateName("City", this.state.user.city, true);
    const emailError = validateEmail(this.state.user.email, true);
    const phone = this.state.phoneSegments.join("");
    const phoneError = validatePhone("Phone", phone, true);
    const newErrors = this.state.errors;
    newErrors[FIRST_ERROR] = firstError;
    newErrors[LAST_ERROR] = lastError;
    newErrors[CITY_ERROR] = cityError;
    newErrors[PHONE_ERROR] = phoneError;
    newErrors[EMAIL_ERROR] = emailError;
    this.setState({ errors: newErrors });

    // if no errors found, set state in parent class
    if (newErrors.join("").length === 0) {
      this.props.setUser(this.state.user);
    }
  };

  onChangeEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newErrors = this.state.errors;
    const errorMessage = validateEmail(e.target.value, this.state.submitted);
    newErrors[EMAIL_ERROR] = errorMessage;
    this.setState({ errors: newErrors });
    this.setState({ user: { ...this.state.user, email: e.target.value } });
  };

  onChangeName = (
    e: React.ChangeEvent<HTMLInputElement>,
    property: string,
    fieldName: string,
    errorType: number
  ) => {
    const newErrors = this.state.errors;
    const errorMessage = validateName(
      fieldName,
      e.target.value,
      this.state.submitted
    );
    newErrors[errorType] = errorMessage;
    this.setState({ errors: newErrors });
    this.setState({ user: { ...this.state.user, [property]: e.target.value } });
  };

  render() {
    return (
      <form onSubmit={(e) => this.onSubmitForm(e)}>
        <u>
          <h3>User Information Form</h3>
        </u>

        <ClassInputName
          label={"First Name"}
          error={this.state.errors[FIRST_ERROR]}
          onChange={(e) =>
            this.onChangeName(e, "first", "First name", FIRST_ERROR)
          }
          value={this.state.user.first}
        />

        <ClassInputName
          label={"Last Name"}
          error={this.state.errors[LAST_ERROR]}
          onChange={(e) =>
            this.onChangeName(e, "last", "Last name", LAST_ERROR)
          }
          value={this.state.user.last}
        />

        <ClassInputName
          label={"City"}
          error={this.state.errors[CITY_ERROR]}
          onChange={(e) => this.onChangeName(e, "city", "City", CITY_ERROR)}
          value={this.state.user.city}
          list="cities"
        />

        <div className="input-wrap">
          <label htmlFor="phone">Phone:</label>
          <div id="phone-input-wrap">
            <input
              type="text"
              ref={this.phoneSegmentRefs[0]}
              onChange={(e) => this.onChangePhoneSegment(e, 0, 2, 2)}
              id="phone-input-1"
              value={this.state.phoneSegments[0]}
            />
            -
            <input
              type="text"
              ref={this.phoneSegmentRefs[1]}
              onChange={(e) => this.onChangePhoneSegment(e, 1, 2, 2)}
              onKeyUp={(e) => this.onKeyUpPhone(e.key, 1)}
              id="phone-input-2"
              value={this.state.phoneSegments[1]}
            />
            -
            <input
              type="text"
              ref={this.phoneSegmentRefs[2]}
              onChange={(e) => this.onChangePhoneSegment(e, 2, 2, 1)}
              onKeyUp={(e) => this.onKeyUpPhone(e.key, 2)}
              id="phone-input-3"
              value={this.state.phoneSegments[2]}
            />
            -
            <input
              type="text"
              ref={this.phoneSegmentRefs[3]}
              onChange={(e) => this.onChangePhoneSegment(e, 3, 1, 0)}
              onKeyUp={(e) => this.onKeyUpPhone(e.key, 3)}
              id="phone-input-4"
              value={this.state.phoneSegments[3]}
            />
          </div>
        </div>
        <ErrorMessage
          message={this.state.errors[PHONE_ERROR]}
          show={this.state.errors[PHONE_ERROR].length > 0}
        />

        <ClassInputName
          label={"Email"}
          error={this.state.errors[EMAIL_ERROR]}
          onChange={(e) => this.onChangeEmail(e)}
          value={this.state.user.email}
        />

        <input type="submit" value="Submit" />
      </form>
    );
  }
}
