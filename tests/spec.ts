import { PersonLogic } from "../src/logic";
import { MockPersonStorage } from "./mock-storage";

describe('PersonLogic', () => {
    let logic: PersonLogic; 

    beforeEach(() => {
        logic = new PersonLogic(new MockPersonStorage());
    });

    it('создает Person', async () => {
        const personId = await logic.createPerson({name: 'Test Person', age: 25});
        const person = await logic.getPerson(personId);

        expect(person).toBeTruthy();
        expect(person!.name).toEqual('Test Person');
        expect(person!.age).toEqual(25);
        expect(person!.id).toEqual(personId);
    });

    it('получает всех Person', async () => {
        for(const i of [1, 2, 3]) {
            await logic.createPerson({name: `Test Person ${i}`});
        }

        const 
            allPersons = await logic.getAllPersons(),
            allPersonNames = allPersons.map((p) => p.name);

        for(const i of [1, 2, 3]) {
            expect(allPersonNames).toContainEqual(`Test Person ${i}`);
        }
    });

    it('обновляет Person', async () => {
        const initialPerson = {
            name: 'Initial Name',
            age: 25,
            work: 'BMSTU'
        };

        const id = await logic.createPerson(initialPerson);

        const personUpdate = {
            name: 'Updated Name',
            age: 26
        };

        const updatedPerson = await logic.updatePerson({id, ...personUpdate});

        expect(updatedPerson).toEqual({...initialPerson, id, ...personUpdate});
    });

    it('удаляет Person', async () => {
        const id = await logic.createPerson({name: 'Test Person'});

        const deleteResult = await logic.deletePerson(id);

        expect(deleteResult).toEqual(true);

        expect(await logic.getPerson(id)).toBeFalsy();
    });
});