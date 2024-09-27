import { Person } from "../logic";

export function validatePersonData(personData: Record<string, unknown>): 
    personData is Omit<Person, 'id'> {
    return typeof personData === 'object' && 
        personData.hasOwnProperty('name') && 
        typeof personData.name === 'string' && 
        (!personData.hasOwnProperty('work') || typeof personData.work === 'string') && 
        (!personData.hasOwnProperty('address') || typeof personData.address === 'string') &&
        (!personData.hasOwnProperty('age') || typeof personData.age === 'number');
}
