import { CanActivate, ExecutionContext } from '@nestjs/common';


// data la interfaccia CanActivate, se questa Guard restituisce falso o simili non si può procedere nell'applicazione
export class AdminGuard implements CanActivate {
    canActivate(context: ExecutionContext){
        const request = context.switchToHttp().getRequest();
        // nella request ci aspettiamo che ce l'abbia messo il current-user.interceptor.ts
        if (!request.currentUser) 
                {return false;}
     
        return request.currentUser.admin;
   
    }
}