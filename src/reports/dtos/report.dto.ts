import { Expose, Transform } from 'class-transformer';
import {User} from '../../users/user.entity';

//  Perchè la risposta mostri i dato come sono descritti in questo Dto
// devo usare prima del contoller o delle singole funzioni del controller: @Serialize(ReportDto)
export class ReportDto {

    @Expose()
    id: number;
    @Expose()
    price: number;
    @Expose()
    year: number;
    @Expose()
    lng: number;
    @Expose()
    lat: number;
    @Expose()
    make: string;
    @Expose()
    model: string;
    @Expose()
    mileage: number;
    @Expose()
    approved: boolean;
    
    // Aggiungo un nuovo campo e lo ricavo dalla entità in questione obj (che qui è Report)
    // tramite il decoratore @Transform 
    @Transform( ({obj}) => obj.user.id  )
    @Expose()
    userId: number;
} 
