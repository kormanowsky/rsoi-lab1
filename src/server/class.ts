import express from 'express';
import { PersonLogic } from '../logic';
import { validatePersonData } from './validators';

export class PersonServer {
    constructor(logic: PersonLogic, port: number = 8888) {
        this.server = express();
        this.server.use(express.json());

        this.port = port;
        this.logic = logic;
        
        this.handleGetAllPersonsRequest = this.handleGetAllPersonsRequest.bind(this);
        this.handleGetOnePersonRequest = this.handleGetOnePersonRequest.bind(this);
        this.handleCreateOnePersonRequest = this.handleCreateOnePersonRequest.bind(this);
        this.handleUpdateOnePersonRequest = this.handleUpdateOnePersonRequest.bind(this);
        this.handleDeleteOnePersonRequest = this.handleDeleteOnePersonRequest.bind(this);

        this.initRoutes();
    }

    start(): void {
        // TODO: возможно, что-то написть в callback функции
        this.server.listen(this.port, '0.0.0.0', () => {});
    }

    stop(): void {
        
    }

    protected initRoutes(): void {
        this.server
            .route('/api/v1/persons')
            .get(this.handleGetAllPersonsRequest)
            .post(this.handleCreateOnePersonRequest);

                
        this.server
            .route('/api/v1/persons/:id')
            .get(this.handleGetOnePersonRequest)
            .patch(this.handleUpdateOnePersonRequest)
            .delete(this.handleDeleteOnePersonRequest);

        // TODO: роут 404?
    }

    protected handleGetAllPersonsRequest(_, res): void {
        this.logic
            .getAllPersons()
            .then((persons) => {
                res.send(persons);
            })
            .catch((err) => {
                // TODO
                res.sendStatus(500);
            });
    }

    protected handleGetOnePersonRequest(req, res): void {
        const id = parseInt(req.params.id, 10);

        if (isNaN(id)) {
            return res.status(404).send({});
        }

        this.logic
            .getPerson(id)
            .then((person) => {
                if (person != null) {
                    res.send(person);
                } else {
                    res.status(404).send();
                }
            })
            .catch((err) => {
                console.log(err);
                // TODO
                res.sendStatus(500);
            });
    }

    protected handleCreateOnePersonRequest(req, res): void {
        const personData = req.body;

        if (!validatePersonData(personData)) {
            return res
                .status(400)
                .send({
                    message: 'invalid data'
                });
        }

        this.logic
            .createPerson(personData)
            .then((id) => {
                res
                    .set('Location', `/api/v1/persons/${id}`)
                    .sendStatus(201);
            })
            .catch((err) => {
                res.sendStatus(500);
            });
    }

    protected handleUpdateOnePersonRequest(req, res): void {
        const id = parseInt(req.params.id, 10);

        if (isNaN(id)) {
            return res.status(404).send({});
        }

        const personData = req.body;

        if (!validatePersonData(personData)) {
            return res
                .status(400)
                .send({
                    message: 'invalid data'
                });
        }

        this.logic
            .updatePerson({id, ...personData})
            .then(() => {
                res.sendStatus(200);
            })
            .catch((err) => {
                // TODO
                res.sendStatus(500);
            });
    }

    protected handleDeleteOnePersonRequest(req, res): void {
        this.logic
            .deletePerson(req.params.id)
            .then(() => {
                res.sendStatus(200);
            })
            .catch((err) => {
                // TODO
                res.sendStatus(500);
            });
    }

    private server: ReturnType<typeof express>;
    private port: number;
    private logic: PersonLogic;
}
