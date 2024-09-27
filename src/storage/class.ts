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

    async updatePerson(person: Partial<Person>): Promise<Person | null> {
        await this.readyPromise;

        if (person.id == null) {
            return null;
        }

        const params: unknown[] = [person.id];
        const setExprs: string[] = [];

        if (person.hasOwnProperty('name')) {
            params.push(person.name);
            setExprs.push(`name = $${setExprs.length + 1}::TEXT`);
        }

        if (person.hasOwnProperty('age')) {
            params.push(person.age);
            setExprs.push(`age = $${setExprs.length + 1}::INTEGER`);
        }

        if (person.hasOwnProperty('work')) {
            params.push(person.work);
            setExprs.push(`work = $${setExprs.length + 1}::TEXT`)
        }

        if (person.hasOwnProperty('address')) {
            params.push(person.address);
            setExprs.push(`address = $${setExprs.length + 1}::TEXT`)
        }

        const result = await this.client.query(
            `UPDATE Persons 
            SET ${setExprs.join(', ')} 
            WHERE id = $1::INTEGER
            RETURNING id, name, age, work, address;`, 
            params
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
