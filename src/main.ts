import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
const cookieSession = require('cookie-session'); // Per questioni di compatibilità si può usare solo require

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  (app as any).set('etag', false);
  app.use((req, res, next) => {
    res.removeHeader('x-powered-by');
    res.removeHeader('date');
    next();
  });
 // tutto questo app.use () questo lo porto nell'app.module.ts per definirlo a livello globale
 // app.use(
 /*   // questo lo porto nell'app.module.ts per definirlo a livello GLOBALE
 cookieSession({
    keys:['safasdfsaf'] // stringa utilizzata per criptare le info nella Session (nel Cookie che contiene la  Session)
  }) 
    */
    /*  // questo lo porto nell'app.module.ts per definirlo a livello globale
  app.useGlobalPipes(
 
    new ValidationPipe({
      whitelist: true,
    })*/
   //, 
  //); 
  await app.listen(3000);
}  
bootstrap();
