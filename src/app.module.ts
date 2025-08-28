
import { MiddlewareConsumer, Module, ValidationPipe } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ReportsModule } from './reports/reports.module';
import { User } from './users/user.entity';
import { Report } from './reports/report.entity';
const cookieSession = require('cookie-session'); // Per questioni di compatibilità si può usare solo require


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal:true,
      envFilePath: `.env.${process.env.NODE_ENV}`, // questa mi fa leggere il file di environment che desidero
      // leggo la NODE_ENV (che quindi compone il file di environment che devo usare ) dal package.json
      // dove trovo NODE_ENV=development o NODE_ENV=test a seconda che io lanci 
      //  npm run start:dev oppure npm run test:e2e 
    }),
    // 2a versione del TypeOrmModule
    // in questo modo permetto al TypeOrmModule di accedere alle configurazioni tramite il ConfigService
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          type: 'sqlite',
          database: config.get<string>('DB_NAME'),
          synchronize: true,
          entities: [User, Report],
        };
      },
    }),
   
   // 1a: versione:
    // TypeOrmModule.forRoot({
    //   type: 'sqlite',
    //   database: 'db.sqlite',
    //   entities: [User, Report],
    //   synchronize: true,
    // }),
    // 3a versione che non sembra funzionare:
   // TypeOrmModule.forRoot(),
    UsersModule,
    ReportsModule,
  ],
  controllers: [AppController],
  providers: [AppService,
    { // definisco le pipe a livello GLOBALE, prima era nel main.ts
      provide: APP_PIPE,
      useValue:  new ValidationPipe({
        whitelist: true,
      })
    }

  ],
})


export class AppModule {
  constructor(private configService: ConfigService) {}
  // questo metodo configure verrà chiamato automaticamente quando la nostra applicazione inizierà ad ascoltare il traffico
  // delle richieste in entrata;
  configure(consumer: MiddlewareConsumer){
    // porto qui la cookie session per usarla in maniera globale; prima era nel main.ts
    // questo MIDDLEWARE mette l'oggetto Session nella RICHIESTA in ENTRATA!!
    consumer.apply(
      cookieSession({
        keys: [this.configService.get('COOKIE_KEY')] //così la prendo dall'.env.xxxxxx giusto 
          //keys:['safasdfsaf'] // stringa utilizzata per criptare le info nella Session (nel Cookie che contiene la  Session)
        }),
   ).forRoutes('*'); // voglio usare questo middleware per qualunque richiesta in entrata
  }
}
  