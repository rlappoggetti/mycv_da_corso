import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';


// Una Guard esamina la Request che ricava da context e in base ai dati che ci sono
// restituisce vero o falso, ovvero SI PUO' PROCEDERE O NO
// data la interfaccia CanActivate, se questa Guard restituisce falso o simili non si può procedere nell'applicazione
export class AuthGuard implements CanActivate {
    canActivate(context: ExecutionContext){
        const request = context.switchToHttp().getRequest();

        return request.session.userId; // se è undefined o vuoto o simili (utente non collegato) non si può procedere oltre
    }
}