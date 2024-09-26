import express from 'express';

export class Server {
    constructor(port: number = 8888) {
        this.server = express();
        this.server.use(express.json());

        this.port = port;
        
        this.handleGetAllRequest = this.handleGetAllRequest.bind(this);
        this.handleGetOneRequest = this.handleGetOneRequest.bind(this);
        this.handleCreateOneRequest = this.handleCreateOneRequest.bind(this);
        this.handleUpdateOneRequest = this.handleUpdateOneRequest.bind(this);
        this.handleDeleteOneRequest = this.handleDeleteOneRequest.bind(this);

        this.initRoutes();
    }

    start(): void {
        // TODO: возможно, что-то написть в callback функции
        this.server.listen(this.port, '0.0.0.0', () => {});
    }

    stop(): void {
        
    }

    protected initRoutes(): void {
        this.server.get('/api/v1/persons', this.handleGetAllRequest);
        this.server.post('/api/v1/persons', this.handleCreateOneRequest);
        this.server.get('/api/v1/persons/:id', this.handleGetOneRequest);
        this.server.patch('/api/v1/persons/:id', this.handleUpdateOneRequest);
        this.server.delete('/api/v1/persons/:id', this.handleDeleteOneRequest);
        // TODO: роут 404?
    }

    protected handleGetAllRequest(req, res): void {
        res.sendStatus(200);

    }

    protected handleGetOneRequest(req, res): void {
        res.sendStatus(200);

    }

    protected handleCreateOneRequest(req, res): void {
        res.sendStatus(200);

    }

    protected handleUpdateOneRequest(req, res): void {
        res.sendStatus(200);

    }

    protected handleDeleteOneRequest(req, res): void {
        res.sendStatus(200);
        
    }

    private server: ReturnType<typeof express>;
    private port: number;
}
