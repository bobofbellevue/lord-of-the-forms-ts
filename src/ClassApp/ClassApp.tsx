import { Component } from "react";
import { ClassForm } from "./ClassForm";
import { User } from "../types";
import { Profile } from "../Profile";

type ClassAppState = {
  userProfile: User | null;
};

export class ClassApp extends Component {
  state: ClassAppState = {
    userProfile: null,
  };

  render() {
    return (
      <>
        <h2>Class</h2>
        <Profile user={this.state.userProfile} />
        <ClassForm
          setUserProfile={(user: User) => this.setState({ userProfile: user })}
        />
      </>
    );
  }
}
