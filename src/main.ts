import { Server } from './server/server';
import { usersRouter } from './routes/usersRouter';

const server = new Server();

server.bootstrap([usersRouter]).then(server => {
    console.log('Server is listeing on: ', server.application.address())
}).catch(error => {
    console.log('Server failed to start on http://localhost:3000')
    console.error(error)
    process.exit(1)
})
