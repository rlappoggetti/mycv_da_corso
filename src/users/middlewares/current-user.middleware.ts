// MIDDLEWARE che sostituisce il current-user.interceptor al fine di agire prima delle guards
// mettendo così a loro disposizione i dati necessari (lo USER)
// anzichè dopo come fanno gli interceptors !!!!!!!
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { UsersService } from '../users.service';
import { User} from '../user.entity';

// aggiungo a proprietà currentUser all'interfaccia Request di Express
// se no non mi verrebbe riconosciuta più sotto nell'istruzione
//       req.currentUser = user;
declare global {
  namespace Express {
    interface Request {
      currentUser?: User;
    }
  }
}

@Injectable()
export class CurrentUserMiddleware implements NestMiddleware {
  constructor(private usersService: UsersService) {}
    // essendo un NestMiddleware deve avere una funzione "use(req,res,next)"
  async use(req: Request, res: Response, next: NextFunction) {
    const { userId } = req.session || {};

    if (userId) {
      const user = await this.usersService.findOne(userId);
      
      req.currentUser = user;
    }

    next();
  }
}
