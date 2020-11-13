import { Router } from './router';
import * as restify from 'restify';
import { NotFoundError } from 'restify-errors';

import { User } from '../models/users/usersModel';

class UsersRouter extends Router {
   constructor(){
     super()
     this.on('beforeRender', document => {
       document.password = undefined
     })
   }
  applyRoutes(application: restify.Server) {
    application.get('/users', (request, response, next) => {
        User.find().then(this.render(response, next))
    })

    application.get('/users/:id', (request, response, next) => {
      User.findById(request.params.id)
        .then(this.render(response, next))
        .catch(next)
    })
      
    application.post('/users', (request, response, next) => {
      let user = new User(request.body)
      user.save()
        .then(this.render(response, next))
        .catch(next)
    })

    application.put('/users/:id', (request, response, next) => {
      const options = { overwrite: true}
      User.update({_id: request.params.id}, request.body, options)
      .exec().then(result => {
        if(result.n){
          return User.findById(request.params.id)
        }else{
          throw new NotFoundError('Document not found');
        }
      })
        .then(this.render(response, next))
        .catch(next)
    })
      
    application.patch('users/:id', (request, response, next) => {
      const options = { new: true }
      User.findByIdAndUpdate({_id: request.params.id}, request.body, options)
        .then(this.render(response, next))
        .catch(next)
    })

    application.del('/users/:id', (request, response, next) => {
      User.remove({_id:request.params.id}).exec()
      .then((cmdResult:any) => {
        if(cmdResult.result.n){
          response.send(204)
        }else{
          throw new NotFoundError('Document not found');
        }
        return next()
      }).catch(next)
    })
  }
}

export const usersRouter = new UsersRouter()