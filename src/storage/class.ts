import pg from 'pg';

import { Person, PersonStorage } from '../logic';

export class PostgresPersonStorage implements PersonStorage {
    constructor(connectionString: string) {
        this.client = new pg.Client({connectionString});
        this.readyPromise = this.initStorage();
    }

    async getAllPersons(): Promise<Person[]> {
        await this.readyPromise;
        
        const result = await this.client.query('SELECT * FROM Persons');

        return result.rows;
    }

    async getPerson(id: Person['id']): Promise<Person | null> {
        await this.readyPromise;

        const result = await this.client.query(
            'SELECT * FROM Persons WHERE id = $1::INTEGER', 
            [id]
        );

        return result.rows.length > 0 ? result.rows[0] : null;
    }

    async createPerson(personData: Omit<Person, 'id'>): Promise<Person['id']> {
        await this.readyPromise;

        const result = await this.client.query(
            `INSERT INTO Persons(name, age, work, address) VALUES 
            ($1::TEXT, $2::INTEGER, $3::TEXT, $4::TEXT) 
            RETURNING id;`, 
            [personData.name, personData.age, personData.work, personData.address]
        );

        return result.rows[0].id;
    }

    async updatePerson(person: Person): Promise<Person | null> {
        await this.readyPromise;

        const result = await this.client.query(
            `UPDATE Persons 
            SET name = $2::TEXT, age = $3::INTEGER, work = $4::TEXT, address = $5::TEXT 
            WHERE id = $1::INTEGER
            RETURNING id, name, age, work, address;`, 
            [person.id, person.name, person.age, person.work, person.address]
        );

        if (result.rows.length === 0) {
            return null;
        }

        return result.rows[0];
    }

    async deletePerson(id: Person['id']): Promise<boolean> {
        await this.readyPromise;

        const result = await this.client.query(
            'DELETE FROM Persons WHERE id = $1::INTEGER RETURNING id;', 
            [id]
        );

        return result.rows.length > 0;
    }

    protected async initStorage() {
        await this.client.connect();

        await this.client.query(`CREATE TABLE IF NOT EXISTS Persons (
            id SERIAL PRIMARY KEY, 
            name TEXT NOT NULL,
            age INTEGER NULL,
            work TEXT NULL,
            address TEXT NULL
        );`);
    }

    private client: typeof pg.Client;
    private readyPromise: Promise<void>;
}
