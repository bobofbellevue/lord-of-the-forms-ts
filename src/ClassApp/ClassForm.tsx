import { Component, FormEvent } from "react";
import {
  getEmailErrors,
  getNameErrors,
  getPhoneErrors,
} from "../utils/validations.ts";
import { ClassInputName } from "./ClassInputName.tsx";
import { ClassInputPhone } from "./ClassInputPhone.tsx";
import { User } from "../types.ts";

type ClassFormProps = {
  setUserProfile(user: User): void;
};

type ClassFormState = {
  firstName: string;
  lastName: string;
  city: string;
  email: string;
  phone: string;
  submitted: boolean;
};

export class ClassForm extends Component<ClassFormProps> {
  state: ClassFormState = {
    firstName: "",
    lastName: "",
    city: "",
    email: "",
    phone: "",
    submitted: false,
  };

  onSubmitForm = (e: FormEvent) => {
    e.preventDefault();

    // Retrieve error messages for all fields after submit - some errors were ignored before submit
    this.setState({ submitted: true });
    const { firstName, lastName, city, email, phone } = this.state;
    let errors = getNameErrors("First name", firstName, true);
    errors += getNameErrors("Last name", lastName, true);
    errors += getNameErrors("City", city, true);
    errors += getEmailErrors(email, true);
    errors += getPhoneErrors(phone, true);

    // if no errors found, set state in parent class
    if (errors === "") {
      this.props.setUserProfile({
        firstName: firstName,
        lastName: lastName,
        city: city,
        phone: phone,
        email: email,
      });
    }
  };

  render() {
    const { firstName, lastName, city, email, phone, submitted } = this.state;
    const firstNameErrors = getNameErrors("First name", firstName, submitted);
    const lastNameErrors = getNameErrors("Last name", lastName, submitted);
    const cityErrors = getNameErrors("City", city, submitted);
    const emailErrors = getEmailErrors(email, submitted);
    const phoneErrors = getPhoneErrors(phone, submitted);
    return (
      <form onSubmit={(e) => this.onSubmitForm(e)}>
        <u>
          <h3>User Information Form</h3>
        </u>

        <ClassInputName
          label={"First Name"}
          value={this.state.firstName}
          onChange={(e) =>
            this.setState({ ...this.state, firstName: e.target.value })
          }
          errors={firstNameErrors}
        />

        <ClassInputName
          label={"Last Name"}
          value={this.state.lastName}
          onChange={(e) =>
            this.setState({ ...this.state, lastName: e.target.value })
          }
          errors={lastNameErrors}
        />

        <ClassInputName
          label={"City"}
          value={this.state.city}
          onChange={(e) =>
            this.setState({ ...this.state, city: e.target.value })
          }
          errors={cityErrors}
          list="cities"
        />

        <ClassInputPhone
          label={"Phone"}
          value={this.state.phone}
          setPhoneState={(value) =>
            this.setState({ ...this.state, phone: value })
          }
          errors={phoneErrors}
        />

        <ClassInputName
          label={"Email"}
          value={this.state.email}
          onChange={(e) =>
            this.setState({ ...this.state, email: e.target.value })
          }
          errors={emailErrors}
        />

        <input type="submit" value="Submit" />
      </form>
    );
  }
}
