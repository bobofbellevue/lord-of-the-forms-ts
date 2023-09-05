import { Component, ChangeEvent, RefObject } from "react";
import { validatePhone } from "../utils/validations";

export interface InputPhoneSegmentProps {
  pos: number;
  max: number;
  nextMax: number;
  submitted: boolean;
  phoneSegments: string[];
  phoneSegmentRefs: RefObject<HTMLInputElement>[];
  setPhoneState(
    phone: string,
    phoneSegments: string[],
    phoneError: string
  ): void;
}

export class ClassInputPhoneSegment extends Component<InputPhoneSegmentProps> {
  onChangePhoneSegment(e: ChangeEvent<HTMLInputElement>) {
    const {
      pos,
      max,
      nextMax,
      phoneSegments,
      phoneSegmentRefs,
      submitted,
      setPhoneState,
    } = this.props;
    // strip out non-digit characters
    const value = e.target.value.replace(/[^0-9]/g, "");
    let phoneSegment = value;
    let phoneExcess = "";
    // strip out characters that exceed field length
    if (phoneSegment.length > max) {
      phoneExcess = phoneSegment.slice(max, max + 1);
      phoneSegment = phoneSegment.slice(0, max);
    }
    const newPhoneSegments = phoneSegments.slice();
    newPhoneSegments[pos] = phoneSegment;
    // excess character can be bumped along to next field if empty
    if (
      pos < 3 &&
      phoneExcess.length === 1 &&
      newPhoneSegments[pos + 1].length === 0
    ) {
      newPhoneSegments[pos + 1] = phoneExcess;
    }
    // determine if we are going backwards - deleting characters - whether by backspace, delete key, or overtyping
    const backwards =
      newPhoneSegments.join("").length < phoneSegments.join("").length;
    const phone = newPhoneSegments.join("");
    const phoneError = validatePhone("Phone", phone, submitted);
    setPhoneState(phone, newPhoneSegments, phoneError);
    // jump to next or previous field and set focus to end of content, in two cases:
    // 1. going forwards if current field is full and there is a next field
    // 2. going backwards if current field is empty and there is a previous field
    if (
      (phoneSegment.length == max && nextMax > 0) ||
      (pos > 0 && backwards && phoneSegment.length === 0)
    ) {
      const newPos = pos + (backwards ? -1 : 1);
      const obj = phoneSegmentRefs[newPos].current;
      if (obj) {
        obj.focus();
        if (
          !backwards &&
          this.props.nextMax == newPhoneSegments[newPos].length
        ) {
          // highlight existing text if it fills up the field
          obj.selectionStart = 0;
          obj.selectionEnd = newPhoneSegments[newPos].length;
        } else {
          // set caret to end of text
          obj.selectionStart = newPhoneSegments[newPos].length;
          obj.selectionEnd = newPhoneSegments[newPos].length;
        }
      }
    }
  }

  onKeyUpPhone(key: React.Key, pos: number) {
    const { phoneSegments, phoneSegmentRefs } = this.props;
    // jump to field and set focus to end of content, if hitting backspace in an empty field (onChange would not be triggered)
    if (key === "Backspace" && phoneSegments[pos].length === 0 && pos > 0) {
      const obj = phoneSegmentRefs[pos - 1].current;
      if (obj) {
        obj.focus();
        obj.selectionStart = phoneSegments[pos - 1].length;
        obj.selectionEnd = phoneSegments[pos - 1].length;
      }
    }
  }

  render() {
    const { pos, phoneSegments, phoneSegmentRefs } = this.props;
    return (
      <input
        type="text"
        ref={phoneSegmentRefs[pos]}
        onChange={(e) => this.onChangePhoneSegment(e)}
        onKeyUp={(e) => this.onKeyUpPhone(e.key, pos)}
        id={`phone-input-${pos + 1}`}
        value={phoneSegments[pos]}
      />
    );
  }
}
