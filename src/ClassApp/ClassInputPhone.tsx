import { Component, createRef } from "react";
import { ErrorMessage } from "../ErrorMessage.tsx";
import { ClassInputPhoneSegment } from "./ClassInputPhoneSegment.tsx";

type ClassInputPhoneProps = {
  phoneSegments: string[];
  submitted: boolean;
  setPhoneState(phone: string, phoneSegments: string[], error: string): void;
  errorMessage: string;
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
              submitted={this.props.submitted}
              phoneSegments={this.props.phoneSegments}
              phoneSegmentRefs={this.phoneSegmentRefs}
              setPhoneState={(phone, phoneSegments, phoneError) =>
                this.props.setPhoneState(phone, phoneSegments, phoneError)
              }
            />
            -
            <ClassInputPhoneSegment
              pos={1}
              max={2}
              nextMax={2}
              submitted={this.props.submitted}
              phoneSegments={this.props.phoneSegments}
              phoneSegmentRefs={this.phoneSegmentRefs}
              setPhoneState={(phone, phoneSegments, phoneError) =>
                this.props.setPhoneState(phone, phoneSegments, phoneError)
              }
            />
            -
            <ClassInputPhoneSegment
              pos={2}
              max={2}
              nextMax={1}
              submitted={this.props.submitted}
              phoneSegments={this.props.phoneSegments}
              phoneSegmentRefs={this.phoneSegmentRefs}
              setPhoneState={(phone, phoneSegments, phoneError) =>
                this.props.setPhoneState(phone, phoneSegments, phoneError)
              }
            />
            -
            <ClassInputPhoneSegment
              pos={3}
              max={1} // this is the short segment - one digit only
              nextMax={0} // no following segment
              submitted={this.props.submitted}
              phoneSegments={this.props.phoneSegments}
              phoneSegmentRefs={this.phoneSegmentRefs}
              setPhoneState={(phone, phoneSegments, phoneError) =>
                this.props.setPhoneState(phone, phoneSegments, phoneError)
              }
            />
          </div>
        </div>
        <ErrorMessage
          message={this.props.errorMessage}
          show={this.props.errorMessage.length > 0}
        />
      </div>
    );
  }
}
