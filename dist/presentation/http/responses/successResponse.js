import { HttpStatusSuccess } from "@core/enum/httpStatusSuccess";
export function ok(res, options) {
    res.status(HttpStatusSuccess.OK).json({
        success: true,
        message: options.message,
        data: options.data,
    });
}
export function created(res, options) {
    res.status(HttpStatusSuccess.CREATED).json({
        success: true,
        message: options.message,
        data: options.data,
    });
}
export function noContent(res) {
    res.sendStatus(HttpStatusSuccess.NO_CONTENT);
}
