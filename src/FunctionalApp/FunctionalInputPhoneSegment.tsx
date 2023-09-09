import { KeyboardEvent, ChangeEvent, RefObject } from "react";

interface InputPhoneSegmentProps {
  pos: number;
  value: string;
  reference: RefObject<HTMLInputElement>;
  onChange(e: ChangeEvent<HTMLInputElement>): void;
  onKeyUp(e: KeyboardEvent<HTMLInputElement>): void;
}

export const FunctionalInputPhoneSegment = (props: InputPhoneSegmentProps) => {
  const { pos, reference, onChange, onKeyUp, value } = props;

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
};
