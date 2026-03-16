import { AutoMap } from "@automapper/classes";

export default class JobRequest
{
    @AutoMap()
    payload!: unknown;

}