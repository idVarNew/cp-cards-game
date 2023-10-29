export interface People {
  message: string;
  total_records: number;
  total_pages: number;
  previous: null;
  next: string;
  results: Result[];
}

export interface PersonResult {
  result: {
    properties: Person;
  };
}

export interface Person {
  height: string;
  mass: string;
  hair_color: string;
  skin_color: string;
  eye_color: string;
  birth_year: string;
  gender: string;
  created: string;
  edited: string;
  name: string;
  homeworld: string;
  url: string;
  winner?: boolean;
}

export interface ErrorMsg {
  message: string;
}

export interface RandomNumbers {
  num1: number;
  num2: number;
}

export interface Counter {
  user1: number;
  user2: number;
}

interface Result {
  uid: string;
  name: string;
  url: string;
}

export type PersonAttributes = 'height' | 'mass';