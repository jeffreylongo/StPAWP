export interface LodgeInfo {
  name: string;
  number: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  email: string;
  website?: string;
  established?: Date;
}

export interface Officer {
  id: number;
  name: string;
  title: string;
  email?: string;
  phone?: string;
  imageUrl?: string;
  bio?: string;
  term?: string;
  order?: number;
}

export interface PastMaster {
  id: number;
  name: string;
  yearServed: string;
  imageUrl?: string;
  bio?: string;
  isDeceased?: boolean;
}
