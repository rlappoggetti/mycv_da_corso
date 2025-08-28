import { 
    Controller, 
    Post, 
    Body, 
    UseGuards,
    Param, 
    Patch,
    Get,
    Query
} from '@nestjs/common';
import { CreateReportDto } from './dtos/create-report.dto';
import { ReportsService } from './reports.service';
import { AuthGuard } from '../guards/auth.guard';
import { CurrentUser } from '../users/decorators/current-user.decorator';
import { User } from '../users/user.entity';
import  {ReportDto} from './dtos/report.dto';
import { Serialize } from '../interceptors/serialize.interceptor';
import  {ApproveReportDto} from './dtos/approve-report.dto';
import { AdminGuard } from '../guards/admin.guard';
import { GetEstimateDto } from './dtos/get-estimate.dto';

@Controller('reports')
export class ReportsController {
  constructor(private reportsService: ReportsService) {}

  // Il decoratore Query estrae la proprietà query (es. ?make=toyota&model=corolla&lng=0&lat=0&mileage=20000&year=1980)
  //dalla Richiesta e la mette nella variabile query come oggetto, v. sotto mostrato con console.log
  // Quest'ultima è validata dal dto GetEstimateDto
  @Get()
  getEstimate(@Query() query:GetEstimateDto){
    /* console.log(query);
   {
      make: 'toyota',
      model: 'corolla',
      lng: 0,
      lat: 0,
      mileage: 20000,
      year: 1980
    }*/
      return this.reportsService.createEstimate(query);
  }

  @Post()
  @UseGuards(AuthGuard)
  @Serialize(ReportDto) // con questa formatto (serializzo) la RISPOSTA della return nella 
  // seguente funzione in modo che mostri solo i campi @Expose() in tale ReportDto
  // e nel modo in cui sono formattati
  createReport(@Body() body: CreateReportDto, @CurrentUser() user:User) {
    // Estraggo dalla Request l'utente collegato, utilizzando il decoratore CurrentUser
    return this.reportsService.create(body,user);
  }

  @UseGuards(AdminGuard)
  @Patch('/:id')
  approveReport(@Param('id') id:string, @Body() body: ApproveReportDto) {
    return this.reportsService.changeApproval(id,body.approved );
  }
}
