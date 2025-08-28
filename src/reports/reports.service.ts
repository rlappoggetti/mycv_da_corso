import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Report } from './report.entity';
import { CreateReportDto } from './dtos/create-report.dto';
import { User } from '../users/user.entity';
import { GetEstimateDto } from './dtos/get-estimate.dto';


@Injectable()
export class ReportsService {
  constructor(@InjectRepository(Report) private repo: Repository<Report>) {}

createEstimate({make, model, lng, lat, year, mileage}: GetEstimateDto){
  return this.repo.createQueryBuilder()
 // .select ('*')   // se voglio tutti i campi, in fondo tra l'altro dovrò mettere .getRawMany()
    .select('AVG(price)', 'price')   // in fondo tra l'altro dovrò mettere getRawOne()
  // se non destrutturassi il dto in entrata, cioè avessi 
  // createEstimate(estimateDto: GetEstimateDto){...} dovrei scrivere:
  // .where('make = :make', {make:estimateDto.make}) !!!!! 
     .where('make = :make', {make})  // che naturalmente sta per {make:make}
     .andWhere('model = :model', {model})  
     .andWhere('lng - :lng BETWEEN -5 AND 5', {lng})  
     .andWhere('lat - :lat BETWEEN -5 AND 5', {lat})  
     .andWhere('year - :year BETWEEN -3 AND 3', {year})  
     .andWhere('approved IS TRUE')  
     .orderBy('ABS(mileage - :mileage)', 'DESC')
     .setParameters({mileage}) // modo di passare i parametri alla order by
     .limit(3) // prendo i 3 più vicini
     //.getRawMany() //se la select restituisce più righe
      .getRawOne() 
}

  create(reportDto: CreateReportDto, user:User) {
    const report = this.repo.create(reportDto);
    report.user = user; // associo così l'utente al report, valorizzando così la relazione
    // In realtà nella Tabella dei report viene scritto solo lo user_id (FK)
    return this.repo.save(report);
  }

  async changeApproval(id: string, approved: boolean) {
    const report = await this.repo.findOne({ where: { id: parseInt(id) } });
    if (!report) {
      throw new NotFoundException('report not found');
    }
    
    report.approved = approved;
    return this.repo.save(report);
  }
  
}
