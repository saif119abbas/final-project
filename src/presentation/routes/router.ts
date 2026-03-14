import { Express } from "express";
import UserRouter from "./user";
export default class Router
{
      constructor(
        private readonly app: Express,
    ) 
      {
        this.registerEndpoints();
      }
      private registerEndpoints() {
        new UserRouter(this.app)
      }
} 