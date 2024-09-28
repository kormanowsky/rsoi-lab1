import { PersonLogic } from './logic';
import { PersonServer } from './server';
import { PostgresPersonStorage } from './storage';

const 
    connectionString = process.env.RSOI1_STORAGE_CONN_STRING ?? 'postgresql://localhost:5432/postgres',
    port = parseInt(process.env.RSOI1_PORT ?? '8888', 10),
    storage = new PostgresPersonStorage(connectionString),
    logic = new PersonLogic(storage),
    server = new PersonServer(logic, port);

server.start();
