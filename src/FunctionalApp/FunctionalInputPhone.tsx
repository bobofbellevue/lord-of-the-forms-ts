import { useRef } from "react";
import { ErrorMessage } from "../ErrorMessage.tsx";
import { FunctionalInputPhoneSegment } from "./FunctionalInputPhoneSegment.tsx";

type FunctionalInputPhoneProps = {
  phoneSegments: string[];
  submitted: boolean;
  setPhoneState(phone: string, phoneSegments: string[], error: string): void;
  errorMessage: string;
};

export const FunctionalInputPhone = (props: FunctionalInputPhoneProps) => {
  const { submitted, phoneSegments, setPhoneState, errorMessage } = props;

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
            submitted={submitted}
            phoneSegments={phoneSegments}
            phoneSegmentRefs={phoneSegmentRefs}
            setPhoneState={(phone, phoneSegments, phoneError) =>
              setPhoneState(phone, phoneSegments, phoneError)
            }
          />
          -
          <FunctionalInputPhoneSegment
            pos={1}
            max={2}
            nextMax={2}
            submitted={submitted}
            phoneSegments={phoneSegments}
            phoneSegmentRefs={phoneSegmentRefs}
            setPhoneState={(phone, phoneSegments, phoneError) =>
              setPhoneState(phone, phoneSegments, phoneError)
            }
          />
          -
          <FunctionalInputPhoneSegment
            pos={2}
            max={2}
            nextMax={1}
            submitted={submitted}
            phoneSegments={phoneSegments}
            phoneSegmentRefs={phoneSegmentRefs}
            setPhoneState={(phone, phoneSegments, phoneError) =>
              setPhoneState(phone, phoneSegments, phoneError)
            }
          />
          -
          <FunctionalInputPhoneSegment
            pos={3}
            max={1}
            nextMax={0}
            submitted={submitted}
            phoneSegments={phoneSegments}
            phoneSegmentRefs={phoneSegmentRefs}
            setPhoneState={(phone, phoneSegments, phoneError) =>
              setPhoneState(phone, phoneSegments, phoneError)
            }
          />
        </div>
      </div>
      <ErrorMessage message={errorMessage} show={errorMessage.length > 0} />
    </div>
  );
};
