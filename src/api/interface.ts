import type { Person } from "../logic";

export type PersonResponse = Person;

export interface ErrorResponse {
    message?: string;
}