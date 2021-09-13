import { ValidationError } from "express-validator";
import { CustomError } from './custom-error';


export class RequestValidataionError extends CustomError {
    statusCode = 400;

    constructor(public errors: ValidationError[]) {
        super('Invalid request parameters');
    }

    serializeErrors() {
        return this.errors.map(err => {
            return {
                message: err.msg,
                field: err.param
            };
        })
    }
}