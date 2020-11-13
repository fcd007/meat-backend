import * as restify from 'restify';
import { BadRequestError } from 'restify-errors';

const mpContentType = 'application/merger-patch+json';

export const mergerPatchBodyParser = (request: restify.Request , response: restify.Response , next) => {
    if(request.getContentType() === mpContentType && request.method === 'PATCH'){
        (<any>request).rawBody = request.body;
        try {
            request.body = JSON.parse(request.body)
        } catch (error) {
            return next(new BadRequestError(`Invalid content: ${error.message}`));
        }
    }
    return next()
}