import pg from 'pg';

import { Person, PersonStorage } from '../logic';

export class PostgresPersonStorage implements PersonStorage {
    constructor(connectionString: string) {
        this.client = new pg.Client({connectionString});

        let resolveReadyPromise: () => void = () => {};

        this.readyPromise = new Promise((resolve) => {resolveReadyPromise = resolve});

        this.initStorage().then(resolveReadyPromise);
    }

    async getAllPersons(): Promise<Person[]> {
        await this.readyPromise;
        
        const result = await this.client.query('SELECT * FROM Persons');

        return result.rows;
    }

    async getPerson(id: Person['id']): Promise<Person | null> {
        await this.readyPromise;

        const result = await this.client.query('SELECT * FROM Persons WHERE id = $1::int32', id);

        return result.rows[0];
    }

    async createPerson(personData: Omit<Person, 'id'>): Promise<Person['id']> {
        await this.readyPromise;

        const result = await this.client.query('INSERT INTO Persons VALUES TODO');

        return result.rows[0].id;
    }

    async updatePerson(person: Person): Promise<void> {
        await this.readyPromise;

        await this.client.query('UPDATE Persons SET TODO WHERE id = $1::int32', id);
    }

    async deletePerson(id: Person['id']): Promise<void> {
        await this.readyPromise;

        await this.client.query('DELETE FROM Persons WHERE id = $1::int32', id);
    }

    protected async initStorage() {
        await this.client.connect();
    }

    private client: typeof pg.Client;
    private readyPromise: Promise<void>;
}
