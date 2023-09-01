import { Component, FormEvent } from "react";
import {
  validateEmail,
  validateName,
  validatePhone,
} from "../utils/validations.ts";
import { ClassInputName } from "./ClassInputName.tsx";
import { ClassFormState, User, ErrorType } from "../types";
import { ClassInputPhone } from "./ClassInputPhone.tsx";

type ClassFormProps = {
  userProfile: User | null;
  setUserProfile(user: User): void;
};

export class ClassForm extends Component<ClassFormProps> {
  state: ClassFormState = {
    userStaging: this.props.userProfile
      ? this.props.userProfile
      : { first: "", last: "", city: "", phone: "", email: "" },
    errors: ["", "", "", "", ""],
    submitted: false,
    phoneSegments: ["", "", "", ""],
  };

  onSubmitForm = (e: FormEvent) => {
    e.preventDefault();
    this.setState({ submitted: true });

    // validate each field because some errors were ignored before submitting - may only be caught now
    const firstError = validateName(
      "First name",
      this.state.userStaging.first,
      true
    );
    const lastError = validateName(
      "Last name",
      this.state.userStaging.last,
      true
    );
    const cityError = validateName("City", this.state.userStaging.city, true);
    const emailError = validateEmail(this.state.userStaging.email, true);
    const phone = this.state.phoneSegments.join("");
    const phoneError = validatePhone("Phone", phone, true);
    const newErrors = this.state.errors;
    newErrors[ErrorType.FirstName] = firstError;
    newErrors[ErrorType.LastName] = lastError;
    newErrors[ErrorType.City] = cityError;
    newErrors[ErrorType.Phone] = phoneError;
    newErrors[ErrorType.Email] = emailError;
    this.setState({ errors: newErrors });

    // if no errors found, set state in parent class
    if (newErrors.join("").length === 0) {
      this.props.setUserProfile(this.state.userStaging);
    }
  };

  render() {
    return (
      <form onSubmit={(e) => this.onSubmitForm(e)}>
        <u>
          <h3>User Information Form</h3>
        </u>

        <ClassInputName
          label={"First Name"}
          value={this.state.userStaging.first}
          errorType={ErrorType.FirstName}
          fieldName={"first"}
          state={this.state}
          setState={(state) => this.setState(state)}
        />

        <ClassInputName
          label={"Last Name"}
          value={this.state.userStaging.last}
          errorType={ErrorType.LastName}
          fieldName={"last"}
          state={this.state}
          setState={(state) => this.setState(state)}
        />

        <ClassInputName
          label={"City"}
          value={this.state.userStaging.city}
          errorType={ErrorType.City}
          fieldName={"city"}
          state={this.state}
          setState={(state) => this.setState(state)}
          list="cities"
        />

        <ClassInputPhone
          state={this.state}
          setState={(state) => this.setState(state)}
        />

        <ClassInputName
          label={"Email"}
          value={this.state.userStaging.email}
          errorType={ErrorType.Email}
          fieldName={"email"}
          state={this.state}
          setState={(state) => this.setState(state)}
        />

        <input type="submit" value="Submit" />
      </form>
    );
  }
}
