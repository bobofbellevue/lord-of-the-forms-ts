import { KeyboardEvent, ChangeEvent, RefObject } from "react";
import { validatePhone } from "../utils/validations";
import { ErrorType, FunctionalStateType } from "../types";

const onChangePhoneSegment = (
  e: ChangeEvent<HTMLInputElement>,
  props: InputPhoneSegmentProps
) => {
  // strip out non-digit characters
  const value = e.target.value.replace(/[^0-9]/g, "");
  let phoneSegment = value;
  let phoneExcess = "";
  // strip out characters that exceed field length
  if (phoneSegment.length > props.max) {
    phoneExcess = phoneSegment.slice(props.max, props.max + 1);
    phoneSegment = phoneSegment.slice(0, props.max);
  }
  const tempPhoneSegments = props.state.phoneSegments.slice();
  tempPhoneSegments[props.pos] = phoneSegment;
  // excess character can be bumped along to next field if empty
  if (
    props.pos < 3 &&
    phoneExcess.length === 1 &&
    tempPhoneSegments[props.pos + 1].length === 0
  ) {
    tempPhoneSegments[props.pos + 1] = phoneExcess;
  }
  // determine if we are going backwards - deleting characters - whether by backspace, delete key, or overtyping
  const backwards =
    tempPhoneSegments.join("").length <
    props.state.phoneSegments.join("").length;
  props.state.setPhoneSegments(tempPhoneSegments);
  const phone = tempPhoneSegments.join("");
  const phoneError = validatePhone("Phone", phone, props.state.submitted);
  const newErrors = props.state.errors;
  newErrors[ErrorType.Phone] = phoneError;
  props.state.setErrors(newErrors);
  // if phone number is complete, update state in user object
  if (phone.length === 7 && !phoneError) {
    props.state.setUserStaging({ ...props.state.userStaging, phone: phone });
  }
  // jump to next or previous field and set focus to end of content, in two cases:
  // 1. going forwards if current field is full and there is a next field
  // 2. going backwards if current field is empty and there is a previous field
  if (
    (props.pos < 3 && phoneSegment.length == props.max && props.nextMax > 0) ||
    (props.pos > 0 && backwards && phoneSegment.length === 0)
  ) {
    const newPos = props.pos + (backwards ? -1 : 1);
    const obj = props.phoneSegmentRefs[newPos].current;
    if (obj) {
      obj.focus();
      if (!backwards && props.nextMax == tempPhoneSegments[newPos].length) {
        // highlight existing text if it fills up the field
        obj.selectionStart = 0;
        obj.selectionEnd = tempPhoneSegments[newPos].length;
      } else {
        // set caret to end of text
        obj.selectionStart = tempPhoneSegments[newPos].length;
        obj.selectionEnd = tempPhoneSegments[newPos].length;
      }
    }
  }
};

const onKeyUpPhone = (
  e: KeyboardEvent<HTMLInputElement>,
  props: InputPhoneSegmentProps
) => {
  // jump to field and set focus to end of content, if hitting backspace in an empty field (onChange would not be triggered)
  if (
    e.key === "Backspace" &&
    props.state.phoneSegments[props.pos].length === 0 &&
    props.pos > 0
  ) {
    const obj = props.phoneSegmentRefs[props.pos - 1].current;
    if (obj) {
      obj.focus();
      obj.selectionStart = props.state.phoneSegments[props.pos - 1].length;
      obj.selectionEnd = props.state.phoneSegments[props.pos - 1].length;
    }
  }
};

interface InputPhoneSegmentProps {
  pos: number;
  max: number;
  nextMax: number;
  state: FunctionalStateType;
  phoneSegmentRefs: RefObject<HTMLInputElement>[];
}

export const FunctionalInputPhoneSegment = (props: InputPhoneSegmentProps) => {
  return (
    <input
      type="text"
      ref={props.phoneSegmentRefs[props.pos]}
      onChange={(e) => onChangePhoneSegment(e, props)}
      onKeyUp={(e) => onKeyUpPhone(e, props)}
      id={`phone-input-${props.pos + 1}`}
      value={props.state.phoneSegments[props.pos]}
    />
  );
};
