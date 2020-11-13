import * as restify from 'restify';

export const handleError = (request: restify.Request, response: restify.Response, err, done ) => {
    err.toJSON = () => {
        console.log(err)
        return {
            message: err.message
        }
    }

    switch (err.name) {
        case 'MongoError':
            if (err.code === 11000) {
                err.statusCode = 400
            }
            break;
        case 'ValidationError':
            err.statusCode = 400
            const messages: any[] = []
            for(let name in err.errors){
                messages.push({message: err.errors[name].message})
            }

            err.toJSON = () => ({
                errors: messages
            })
            break;
        default:
            break;
    }
    done()
}