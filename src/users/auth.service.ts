import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { UsersService } from './users.service';
import { randomBytes, scrypt as _scrypt } from 'crypto'; // rinomino script in _script 
import { promisify } from 'util';

const scrypt = promisify(_scrypt); // promisify permette l'uso di _script con Promises anzichè callbacks
 

@Injectable()
export class AuthService {
    constructor(private usersService:UsersService){}

    async signup(email:string, password: string) {
        // see if e mail is in use
      const users = await this.usersService.find(email);

      if (users.length )   {
            throw new BadRequestException('mail già utilizzata');
      }
      // hash the users password
        // Generate a Salt
        const salt = randomBytes(8).toString('hex');
        // Hash the salt and the password together
        // unisco in un hash di 32 bytes password e Salt; con as Buffer aiuto Typescript che altrimenti non capisce che tipo di dato è 
        const hash = (await scrypt(password, salt, 32)) as Buffer; 

        // Join the hashed result and the salt together 
        const result = salt + '.' + hash.toString('hex');

      // create a new user and save it
        const user =  await this.usersService.create(email,result);
      // return the user
      return user;
    }

    async signin(email:string, password: string) {
      const  [user] = await this.usersService.find(email); 

      if (!user )   {
            throw new NotFoundException('Utente non trovato');
      }

      const [salt, storedHash] = user.password.split('.');


      const hash = (await scrypt(password, salt, 32)) as Buffer; 

      if (storedHash !== hash.toString('hex') ){
        throw new BadRequestException('Password errata');
      }

      return user;

    }
}