import { Component, FormEvent } from "react";
import {
  validateEmail,
  validateName,
  validatePhone,
} from "../utils/validations.ts";
import { ClassInputName } from "./ClassInputName.tsx";
import { ErrorMessages, User } from "../types";
import { ClassInputPhone } from "./ClassInputPhone.tsx";

type ClassFormProps = {
  userProfile: User | null;
  setUserProfile(user: User): void;
};

type ClassFormState = {
  user: User;
  errors: ErrorMessages;
  submitted: boolean;
  phoneSegments: string[];
};

export class ClassForm extends Component<ClassFormProps> {
  state: ClassFormState = {
    user: this.props.userProfile
      ? this.props.userProfile
      : { first: "", last: "", city: "", phone: "", email: "" },
    errors: { first: "", last: "", email: "", city: "", phone: "" },
    submitted: false,
    phoneSegments: ["", "", "", ""],
  };

  onSubmitForm = (e: FormEvent) => {
    const { user, phoneSegments } = this.state;
    e.preventDefault();
    this.setState({ submitted: true });

    // validate each field because some errors were ignored before submitting - may only be caught now
    const newErrors = { first: "", last: "", email: "", city: "", phone: "" };
    newErrors["first"] = validateName("First name", user.first, true);
    newErrors["last"] = validateName("Last name", user.last, true);
    newErrors["city"] = validateName("City", user.city, true);
    newErrors["email"] = validateEmail(user.email, true);
    const phone = phoneSegments.join("");
    newErrors["phone"] = validatePhone("Phone", phone, true);
    this.setState({ errors: newErrors });

    // if no errors found, set state in parent class
    if (
      Object.entries(newErrors).find((keyvalue) => keyvalue[1].length > 0) ==
      undefined
    ) {
      this.props.setUserProfile(this.state.user);
    }
  };

  setEmailState = (email: string, error: string) => {
    this.setState({
      user: { ...this.state.user, email: email },
      errors: { ...this.state.errors, email: error },
    });
  };

  setNameState = (fieldName: string, name: string, error: string) => {
    this.setState({
      user: { ...this.state.user, [fieldName]: name },
      errors: { ...this.state.errors, [fieldName]: error },
    });
  };

  setPhoneState = (
    phone: string,
    phoneSegments: string[],
    phoneError: string
  ) => {
    // if phone number is complete, update state in user object
    if (phone.length === 7 && !phoneError) {
      this.setState({
        user: { ...this.state.user, phone: phone },
        phoneSegments: phoneSegments,
        errors: { ...this.state.errors, phone: "" },
      });
    } else {
      this.setState({
        phoneSegments: phoneSegments,
        errors: { ...this.state.errors, phone: phoneError },
      });
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
          value={this.state.user.first}
          fieldName={"first"}
          submitted={this.state.submitted}
          setNameState={(fieldName, name, error) =>
            this.setNameState(fieldName, name, error)
          }
          errorMessage={this.state.errors["first"]}
        />

        <ClassInputName
          label={"Last Name"}
          value={this.state.user.last}
          fieldName={"last"}
          submitted={this.state.submitted}
          setNameState={(fieldName, name, error) =>
            this.setNameState(fieldName, name, error)
          }
          errorMessage={this.state.errors["last"]}
        />

        <ClassInputName
          label={"City"}
          value={this.state.user.city}
          fieldName={"city"}
          submitted={this.state.submitted}
          setNameState={(fieldName, name, error) =>
            this.setNameState(fieldName, name, error)
          }
          errorMessage={this.state.errors["city"]}
          list="cities"
        />

        <ClassInputPhone
          phoneSegments={this.state.phoneSegments}
          submitted={this.state.submitted}
          setPhoneState={(phone, phoneSegments, phoneError) =>
            this.setPhoneState(phone, phoneSegments, phoneError)
          }
          errorMessage={this.state.errors["phone"]}
        />

        <ClassInputName
          label={"Email"}
          value={this.state.user.email}
          fieldName={"email"}
          submitted={this.state.submitted}
          errorMessage={this.state.errors["email"]}
          setEmailState={(email, error) => this.setEmailState(email, error)}
        />

        <input type="submit" value="Submit" />
      </form>
    );
  }
}
