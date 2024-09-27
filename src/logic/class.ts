import { Person, PersonStorage } from "./interface";

export class PersonLogic {
    constructor(storage: PersonStorage) {
        this.storage = storage;
    }

    getAllPersons(): Promise<Person[]> {
        return this.storage.getAllPersons();
    }

    getPerson(id: Person['id']): Promise<Person | null> {
        return this.storage.getPerson(id);
    }

    createPerson(personData: Omit<Person, 'id'>): Promise<Person['id']> {
        return this.storage.createPerson(personData);
    }

    updatePerson(person: Person): Promise<Person | null> {
        return this.storage.updatePerson(person);
    }

    deletePerson(id: Person['id']): Promise<boolean> {
        return this.storage.deletePerson(id);
    }

    private storage: PersonStorage;
}