import { useRef } from "react";
import { ErrorMessage } from "../ErrorMessage.tsx";
import { ErrorType, FunctionalStateType } from "../types.ts";
import { FunctionalInputPhoneSegment } from "./FunctionalInputPhoneSegment.tsx";

type FunctionalInputPhoneType = {
  state: FunctionalStateType;
};

export const FunctionalInputPhone = (props: FunctionalInputPhoneType) => {
  const phoneSegmentRefs: React.RefObject<HTMLInputElement>[] = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];
  return (
    <div>
      <div className="input-wrap">
        <label htmlFor="phone">Phone:</label>
        <div id="phone-input-wrap">
          <FunctionalInputPhoneSegment
            pos={0}
            max={2}
            nextMax={2}
            state={props.state}
            phoneSegmentRefs={phoneSegmentRefs}
          />
          -
          <FunctionalInputPhoneSegment
            pos={1}
            max={2}
            nextMax={2}
            state={props.state}
            phoneSegmentRefs={phoneSegmentRefs}
          />
          -
          <FunctionalInputPhoneSegment
            pos={2}
            max={2}
            nextMax={1}
            state={props.state}
            phoneSegmentRefs={phoneSegmentRefs}
          />
          -
          <FunctionalInputPhoneSegment
            pos={3}
            max={1}
            nextMax={0}
            state={props.state}
            phoneSegmentRefs={phoneSegmentRefs}
          />
        </div>
      </div>
      <ErrorMessage
        message={props.state.errors[ErrorType.Phone]}
        show={props.state.errors[ErrorType.Phone].length > 0}
      />
    </div>
  );
};
