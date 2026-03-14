import UserRouter from "./user";
export default class Router {
    app;
    constructor(app) {
        this.app = app;
        this.registerEndpoints();
    }
    registerEndpoints() {
        new UserRouter(this.app);
    }
}
