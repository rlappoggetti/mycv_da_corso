import { Module, MiddlewareConsumer } from '@nestjs/common';
// modo 3 non mi serve più l'Interceptor import { APP_INTERCEPTOR } from '@nestjs/core'; //uso CurrentUserInterceptor e gli altri Intercettori modo 2 (Globale)
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { AuthService } from './auth.service';
// modo 3 non mi serve più l'Interceptor import {CurrentUserInterceptor} from './interceptors/current-user.interceptor';
import { CurrentUserMiddleware } from './middlewares/current-user.middleware';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [
    UsersService,
    AuthService,
   // CurrentUserInterceptor, //uso CurrentUserInterceptor modo 1
   //uso CurrentUserInterceptor e gli altri Intercettori modo 2 (Globale):
  /* Modo 3 uso invece il Middleware qui sotto in configure della classe
   {
    provide: APP_INTERCEPTOR,
    useClass: CurrentUserInterceptor
   } // in questo modo 2 l'Interceptor è automaticamente chiamato per tutti i controlli del Modulo
   */
  ],
})
export class UsersModule {
  // questo metodo configure verrà chiamato automaticamente quando la nostra applicazione
  // inizierà ad ascoltare il traffico delle richieste in entrata;
  // così mi metterà lo user nel currentUser della session!!!!
  // QUESTO MIDDLEWARE sostituisce l'INTERCEPTOR CurrentUserInterceptor qui sopra
  configure(consumer: MiddlewareConsumer){
    consumer.apply(CurrentUserMiddleware).forRoutes('*');  // voglio usare questo middleware per qualunque richiesta/route in entrata
  }
}
 