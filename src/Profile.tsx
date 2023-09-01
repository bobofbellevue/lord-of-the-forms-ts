import { User } from "./types";
import { formatPhoneNumber } from "./utils/transformations";

export interface ProfileProps {
  user: User | null;
}

export const InfoRow = ({ label, value }: { label: string; value: string }) => {
  return (
    <div>
      <span style={{ marginRight: 5 }}>
        <b>{label}:</b>
      </span>
      <span>{value}</span>
    </div>
  );
};

export const Profile = (props: ProfileProps) => {
  return (
    <>
      <u>
        {props.user ? (
          <h3>Your Submitted User Information</h3>
        ) : (
          <h3>No Profile Submitted</h3>
        )}
      </u>
      {props.user ? (
        <div className="user-info">
          <InfoRow label="First Name" value={props.user.first} />
          <InfoRow label="Last Name" value={props.user.last} />
          <InfoRow label="City" value={props.user.city} />
          <InfoRow label="Phone" value={formatPhoneNumber(props.user.phone)} />
          <InfoRow label="Email" value={props.user.email} />
        </div>
      ) : (
        <div></div>
      )}
    </>
  );
};
