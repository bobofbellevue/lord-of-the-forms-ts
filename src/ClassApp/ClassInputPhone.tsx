import { Component, createRef } from "react";
import { ErrorMessage } from "../ErrorMessage.tsx";
import { ErrorType, ClassFormState } from "../types.ts";
import { ClassInputPhoneSegment } from "./ClassInputPhoneSegment.tsx";

type ClassInputPhoneProps = {
  state: ClassFormState;
  setState(state: ClassFormState): void;
};

export class ClassInputPhone extends Component<ClassInputPhoneProps> {
  // These refs used to reposition the cursor and caret among the phone segment fields
  phoneSegmentRefs: React.RefObject<HTMLInputElement>[] = [
    createRef<HTMLInputElement>(),
    createRef<HTMLInputElement>(),
    createRef<HTMLInputElement>(),
    createRef<HTMLInputElement>(),
  ];

  render() {
    return (
      <div>
        <div className="input-wrap">
          <label htmlFor="phone">Phone:</label>
          <div id="phone-input-wrap">
            <ClassInputPhoneSegment
              pos={0} // 0 = first phone segment
              max={2} // length of this segment
              nextMax={2} // length of the next segment, if any
              state={this.props.state}
              setState={this.props.setState}
              phoneSegmentRefs={this.phoneSegmentRefs}
            />
            -
            <ClassInputPhoneSegment
              pos={1}
              max={2}
              nextMax={2}
              state={this.props.state}
              setState={this.props.setState}
              phoneSegmentRefs={this.phoneSegmentRefs}
            />
            -
            <ClassInputPhoneSegment
              pos={2}
              max={2}
              nextMax={1}
              state={this.props.state}
              setState={this.props.setState}
              phoneSegmentRefs={this.phoneSegmentRefs}
            />
            -
            <ClassInputPhoneSegment
              pos={3}
              max={1} // this is the short segment - one digit only
              nextMax={0} // no following segment
              state={this.props.state}
              setState={this.props.setState}
              phoneSegmentRefs={this.phoneSegmentRefs}
            />
          </div>
        </div>
        <ErrorMessage
          message={this.props.state.errors[ErrorType.Phone]}
          show={this.props.state.errors[ErrorType.Phone].length > 0}
        />
      </div>
    );
  }
}
