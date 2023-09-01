import { Component, ChangeEvent, RefObject } from "react";
import { validatePhone } from "../utils/validations";
import { ErrorType, ClassFormState } from "../types";

export interface InputPhoneSegmentProps {
  pos: number;
  max: number;
  nextMax: number;
  state: ClassFormState;
  setState(state: ClassFormState): void;
  phoneSegmentRefs: RefObject<HTMLInputElement>[];
}

export class ClassInputPhoneSegment extends Component<InputPhoneSegmentProps> {
  onChangePhoneSegment(e: ChangeEvent<HTMLInputElement>) {
    // strip out non-digit characters
    const value = e.target.value.replace(/[^0-9]/g, "");
    let phoneSegment = value;
    let phoneExcess = "";
    // strip out characters that exceed field length
    if (phoneSegment.length > this.props.max) {
      phoneExcess = phoneSegment.slice(this.props.max, this.props.max + 1);
      phoneSegment = phoneSegment.slice(0, this.props.max);
    }
    const newPhoneSegments = this.props.state.phoneSegments.slice();
    newPhoneSegments[this.props.pos] = phoneSegment;
    // excess character can be bumped along to next field if empty
    if (
      this.props.pos < 3 &&
      phoneExcess.length === 1 &&
      newPhoneSegments[this.props.pos + 1].length === 0
    ) {
      newPhoneSegments[this.props.pos + 1] = phoneExcess;
    }
    // determine if we are going backwards - deleting characters - whether by backspace, delete key, or overtyping
    const backwards =
      newPhoneSegments.join("").length <
      this.props.state.phoneSegments.join("").length;
    const phone = newPhoneSegments.join("");
    const phoneError = validatePhone(
      "Phone",
      phone,
      this.props.state.submitted
    );
    const newErrors = this.props.state.errors;
    newErrors[ErrorType.Phone] = phoneError;
    // if phone number is complete, update state in user object
    if (phone.length === 7 && !phoneError) {
      this.props.setState({
        ...this.props.state,
        userStaging: { ...this.props.state.userStaging, phone: phone },
        phoneSegments: newPhoneSegments,
        errors: newErrors,
      });
    } else {
      this.props.setState({
        ...this.props.state,
        phoneSegments: newPhoneSegments,
        errors: newErrors,
      });
    }
    // jump to next or previous field and set focus to end of content, in two cases:
    // 1. going forwards if current field is full and there is a next field
    // 2. going backwards if current field is empty and there is a previous field
    if (
      (phoneSegment.length == this.props.max && this.props.nextMax > 0) ||
      (this.props.pos > 0 && backwards && phoneSegment.length === 0)
    ) {
      const newPos = this.props.pos + (backwards ? -1 : 1);
      const obj = this.props.phoneSegmentRefs[newPos].current;
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
    // jump to field and set focus to end of content, if hitting backspace in an empty field (onChange would not be triggered)
    if (
      key === "Backspace" &&
      this.props.state.phoneSegments[pos].length === 0 &&
      pos > 0
    ) {
      const obj = this.props.phoneSegmentRefs[pos - 1].current;
      if (obj) {
        obj.focus();
        obj.selectionStart = this.props.state.phoneSegments[pos - 1].length;
        obj.selectionEnd = this.props.state.phoneSegments[pos - 1].length;
      }
    }
  }

  render() {
    return (
      <input
        type="text"
        ref={this.props.phoneSegmentRefs[this.props.pos]}
        onChange={(e) => this.onChangePhoneSegment(e)}
        onKeyUp={(e) => this.onKeyUpPhone(e.key, this.props.pos)}
        id={`phone-input-${this.props.pos + 1}`}
        value={this.props.state.phoneSegments[this.props.pos]}
      />
    );
  }
}
