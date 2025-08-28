import {
    NestInterceptor,
    ExecutionContext,
    CallHandler,
    Injectable,
  } from '@nestjs/common';
  import { UsersService } from '../users.service';

  // Questo Intercettore mette lo User collegato nella Request così il Decoratore CurrentUser può recuperarlo da questa e metterlo
  // a disposizione del servizio che chiama, es. whoAmI(@CurrentUser() user:User) {....}
  @Injectable() //posso usare questo decoratore perchè gli interceptor fanno parte della DI
  export class CurrentUserInterceptor implements NestInterceptor {
    constructor(private userService:UsersService){

    }
    // siccome implementa l'interfaccia NestInterceptor (che fa da "GUIDA") deve avere un metodo intercept con questi due parametri di questo tipo
    async intercept(context:ExecutionContext, handler:CallHandler){
        const request = context.switchToHttp().getRequest();
        const {userId} = request.session||{}; //prendo il valore dello userId dalla sessione

        if (userId){
            // !!!!! recupero l'utente e lo assegno alla request alla quale il DECORATORE HA ACCESSO!!!!!!!
            // per cui lo potrà recuperare e FORNIRE !!!!!!!!!
            const user = await this.userService.findOne(userId);
            request.currentUser =  user;
        }
        return handler.handle(); // in sostaza significa "prosegui con quello che devi fare"
    }
  }