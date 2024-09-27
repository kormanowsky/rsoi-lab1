export interface Person {
    id: number;
    name: string;
    age?: number;
    address?: string;
    work?: string;
}

export interface PersonStorage {
    getAllPersons(): Promise<Person[]>;
    getPerson(id: Person['id']): Promise<Person | null>;
    createPerson(personData: Omit<Person, 'id'>): Promise<Person['id']>;
    updatePerson(person: Person): Promise<Person | null>;
    deletePerson(id: Person['id']): Promise<boolean>;
}