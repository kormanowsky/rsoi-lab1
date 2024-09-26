import type { Person } from "../logic";

export type PersonRequest = Omit<Person, 'id'>;

export type PersonResponse = Person;
export type PersonsResponse = PersonResponse[];

export interface ErrorResponse {
    message?: string;
}

export interface ValidationErrorResponse extends ErrorResponse {
    errors: {additionalProperties?: string};
}
