import IError from "@core/interfaces/error";

export default class ConflictError extends Error implements IError {
    public name = "Conflict Error";
    public httpStatus = 409;

    public entity!: string;
    public identifier!: string;
    public value?: string | string[];
    constructor(message: string);
    constructor(entity: string, identifier: string, value?: string);
    constructor(entity: string, identifier: string, values: string[]);

    constructor(entityOrMessage: string, identifier?: string, value?: string | string[]) {
        const formattedValue = Array.isArray(value)
            ? value.map((v) => `'${v}'`).join(", ")
            : value
              ? `'${value}'`
              : "";

        const message =
            identifier === undefined
                ? entityOrMessage
                : `${entityOrMessage} with ${identifier}${
                      formattedValue ? ` ${formattedValue}` : ""
                  } already exists`;

        super(message);

        this.entity = identifier ? entityOrMessage : "resource";
        this.identifier = identifier ?? "";
        this.value = value;
    }
}
