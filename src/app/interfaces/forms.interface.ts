export interface ContactForm {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

export interface MembershipForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  dateOfBirth: Date;
  occupation: string;
  employer?: string;
  references?: MemberReference[];
  agreeToTerms: boolean;
}

export interface MemberReference {
  name: string;
  relationship: string;
  phone?: string;
  email?: string;
}

export interface FormValidation {
  field: string;
  message: string;
  type: 'required' | 'email' | 'phone' | 'minLength' | 'maxLength' | 'pattern';
}
