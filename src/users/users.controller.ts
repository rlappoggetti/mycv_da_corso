import {
  Body,
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Param,
  Query,
  NotFoundException,
  Session,
  UseGuards
 // UseInterceptors //uso CurrentUserInterceptor modo 1
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UsersService } from './users.service';
import { Serialize } from '../interceptors/serialize.interceptor';
import { UserDto } from './dtos/user.dto';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/current-user.decorator';
// import {CurrentUserInterceptor} from './interceptors/current-user.interceptor'; //uso CurrentUserInterceptor modo 1
import { User } from './user.entity';  
import { AuthGuard } from '../guards/auth.guard';


@Controller('auth')
@Serialize(UserDto)
// @UseInterceptors(CurrentUserInterceptor) //uso CurrentUserInterceptor modo 1
export class UsersController {
  constructor(private usersService: UsersService, private authService:AuthService) {}

/* // Prendo l'oggetto sessione dal Cookie (che forse coincide direttamnente col cookie??) tramite il decoratore @Session e gli assegno/riempio la proprietà color

  @Get('/colors/:color')
  setColor(@Param('color') color:string ,   @Session() session:any){
      session.color = color;
  }

  @Get('/colors')
  getColor( @Session() session:any){
      return session.color;
  }
  */
/*
  @Get('/whoami')
  whoAmI(@Session() session:any) {
   return this.usersService.findOne(session.userId);
  }
  */


  @Get('/whoami')
  @UseGuards(AuthGuard) // la uso in questo caso a livello di servizio (ma potrei usarla a un livello più alto)
  whoAmI(@CurrentUser() user:User) {
   return user;
  }

  @Post('/signout')
  signOut(@Session() session:any) {
    session.userId = null;
  }


  // prendiamo l'oggetto session e gli assegnamo e/o valorizziamo la proprietà userId
  @Post('/signup')
  async  createUser(@Body() body: CreateUserDto, @Session() session:any) {
    const user = await  this.authService.signup(body.email, body.password);
    session.userId = user.id;
    return user;
   // return this.authService.signup(body.email, body.password);
  }

  @Post('/signin')
  async  signin(@Body() body: CreateUserDto, @Session() session:any) {
    const user = await this.authService.signin(body.email, body.password);
    session.userId = user.id;
    return user;
  }

  @Get('/:id')
  async findUser(@Param('id') id: string) {
    const user = await this.usersService.findOne(parseInt(id));
    if (!user) {
      throw new NotFoundException('user indeed not found really fatto per svil2');
    }
    return user;
  }

  @Get()
  findAllUsers(@Query('email') email: string) {
    return this.usersService.find(email);
  }

  @Delete('/:id')
  removeUser(@Param('id') id: string) {
    return this.usersService.remove(parseInt(id));
  }

  @Patch('/:id')
  updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
    return this.usersService.update(parseInt(id), body);
  }
}
