// NOTE TO REVIEWER: see below
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
          userProfile={this.state.userProfile}
          // NOTE TO REVIEWER: see below
          setUserProfile={(user: User) => this.setState({ userProfile: user })}
        />
      </>
    );
  }
}

/* NOTE TO REVIEWER

I tried three variations of the line above:

This one works:
setUserProfile={(user: User) => this.setState({ userProfile: user })}

This one blows up.  Something inside of React is undefined (enqueueSetState).
setUserProfile={this.setState}

This one doesn't blow up, but doesn't work either - state not changed apparently.  I didn't investigate further.  No Typescript warning on this line.
setUserProfile={(user) => this.setState(user)}

Is there a better technique for passing a state setter to a child component?  I used to make a custom function for each state field and pass that down,
but was needing to pass up to half a dozen of them at a time.  Then I thought, why not pass down the whole state with the setState function?

*/
