import { Person, PersonStorage } from "../src/logic";

export class MockPersonStorage implements PersonStorage {
    async createPerson(personData: Omit<Person, "id">): Promise<Person["id"]> {
        const id = ++this.nextPersonId;
        
        this.storage[id] = {id, ...personData};

        return id;
    }

    async getAllPersons(): Promise<Person[]> {
        return Object.values(this.storage);
    }

    async getPerson(id: Person["id"]): Promise<Person | null> {
        if (this.storage.hasOwnProperty(id)) {
            return this.storage[id];
        }

        return null;
    }

    async updatePerson(person: Partial<Person>): Promise<Person | null> {
        if (person.id == null) {
            return null;
        }

        if (this.storage.hasOwnProperty(person.id)) {
          this.storage[person.id] = {...this.storage[person.id], ...person};

          return this.storage[person.id];
        }

        return null;
    }

    async deletePerson(id: Person["id"]): Promise<boolean> {
        if (this.storage.hasOwnProperty(id)) {
            delete this.storage[id];

            return true;
        }

        return false;
    }

    private storage: Record<Person['id'], Person> = {};
    private nextPersonId: Person['id'] = 0;
}