import { PersonResult } from '../app.models';

export const personResultMock: PersonResult = {
  result: {
    properties: {
      height: '172',
      mass: '200',
      hair_color: 'blond',
      skin_color: 'fair',
      eye_color: 'blue',
      birth_year: '19BBY',
      gender: 'male',
      created: '2023-10-27T05:57:00.526Z',
      edited: '2023-10-27T05:57:00.526Z',
      name: 'Luke Skywalker',
      homeworld: 'https://www.swapi.tech/api/planets/1',
      url: 'https://www.swapi.tech/api/people/1',
    },
  },
};

export const personResult1Mock: PersonResult = {
  result: {
    properties: {
      height: '572',
      mass: '200',
      hair_color: 'blond',
      skin_color: 'fair',
      eye_color: 'blue',
      birth_year: '19BBY',
      gender: 'male',
      created: '2023-10-27T05:57:00.526Z',
      edited: '2023-10-27T05:57:00.526Z',
      name: 'Luke',
      homeworld: 'https://www.swapi.tech/api/planets/1',
      url: 'https://www.swapi.tech/api/people/1',
    },
  },
};
