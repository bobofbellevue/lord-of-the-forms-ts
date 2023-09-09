import { Component, RefObject, ChangeEvent, KeyboardEvent } from "react";

export type InputPhoneSegmentProps = {
  value: string;
  pos: number;
  reference: RefObject<HTMLInputElement>;
  onChange(e: ChangeEvent<HTMLInputElement>): void;
  onKeyUp(e: KeyboardEvent<HTMLInputElement>): void;
};

export class ClassInputPhoneSegment extends Component<InputPhoneSegmentProps> {
  render() {
    const { pos, reference, value, onChange, onKeyUp } = this.props;
    return (
      <input
        type="text"
        ref={reference}
        onChange={(e) => onChange(e)}
        onKeyUp={(e) => onKeyUp(e)}
        id={`phone-input-${pos + 1}`}
        value={value}
      />
    );
  }
}
