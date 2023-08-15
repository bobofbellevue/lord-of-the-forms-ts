import { Component } from "react";
import { ClassForm } from "./ClassForm";
import { User } from "../types";
import { Profile } from "../Profile";

export class ClassApp extends Component {
  state = {
    user: {
      first: "",
      last: "",
      city: "",
      phone: "",
      email: "",
    },
  };
  setUser(user: User) {
    this.setState({ user: user });
  }
  render() {
    return (
      <>
        <h2>Class</h2>
        <Profile user={this.state.user} />
        <ClassForm
          user={this.state.user}
          setUser={(user) => this.setUser(user)}
        />
      </>
    );
  }
}
