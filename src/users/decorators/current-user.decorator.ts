import {
    createParamDecorator,
    ExecutionContext
}  from '@nestjs/common';

// Creo un mio decoratore con il metodo createParamDecorator
export const CurrentUser = createParamDecorator (
    // il decorator @CurrentUser pescherà ad esempio dal COntext /restituirà quello che restituisce questa funzione che passo a createParamDecorator:
    // data sono i parametri passati al decoratore: @CurrentUser(data)
    // nel nostro caso invece di data:any passiamo solo data:never perchè non prevediamo di passargli parametri
    (data:never, context:ExecutionContext) => {
        //ExecutionContext di fatto è la Request in entrata anche se prevede anche altri tipi
        const request = context.switchToHttp().getRequest();
        //console.log(request.session.userId); // anche dalla request possiamo recuperare userId dalla la sessione
        // in realtà non possiamo accedere direttamente allo UserService per ricavare lo user (per chiave userId) infatti:

        // !!!!!!!!!!!!! PURTROPPO I PARAM DECORATOR esistono al di fuori della DI (Dependency Injection),
        // pertanto  NON POSSONO ACCEDERE AI SERVIZI (es UserService) !!!!!!!!!!!!!
        // per cui non si può accedere direttamente al servizio con lo userId per ricavare lo user!!!
        // Serve quindi anche un INTERCEPTOR che recuperi l'utente, perchè gli interceptor invece fanno parte della DI!!!
        // IL CURRENT USER CHE STO RECUPERANDO LO HA MESSO NELLA REQUEST L'INTERCEPTOR CurrentUserInterceptor DEFINITO AD HOC
        // che deve essere CHIAMATO PRIMA DI QUESTO DECORATORE!!!!!!!!!!!
        // o prima del Controller desiderato (v.nel codice qua e là le istruzioni marcate con "//uso CurrentUserInterceptor modo 1") 
        // o per tutti definendo nel Modulo un Interceptor GLOBALE :
        // (v.nel codice qua e là le istruzioni marcate con "uso CurrentUserInterceptor e gli altri Intercettori modo 2 (Globale)"
        // che dovrebbero essere solo nello userModule
        return request.currentUser; 
    }
)