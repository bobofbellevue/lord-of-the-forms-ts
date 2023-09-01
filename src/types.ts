export type User = {
  first: string;
  last: string;
  city: string;
  phone: string;
  email: string;
};

export enum ErrorType {
  FirstName = 0,
  LastName,
  City,
  Email,
  Phone,
}

export type ClassFormState = {
  userStaging: User;
  errors: string[];
  submitted: boolean;
  phoneSegments: string[];
};

export type FunctionalStateType = {
  userProfile: User;
  setUserProfile(user: User): void;
  userStaging: User;
  setUserStaging(user: User): void;
  errors: string[];
  setErrors(errors: string[]): void;
  phoneSegments: string[];
  setPhoneSegments(phoneSegments: string[]): void;
  submitted: boolean;
  setSubmitted(status: boolean): void;
};