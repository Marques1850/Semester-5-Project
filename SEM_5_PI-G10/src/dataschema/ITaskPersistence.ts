import { TypeTask } from "../domain/typeTask";


export interface ITaskPersistence {
    _id: string;
    code: string;
    typeTask: TypeTask;
    description: string;
}