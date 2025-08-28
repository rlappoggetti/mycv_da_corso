import {
    IsString,
    IsNumber,
    Min,
    Max,
    IsLongitude,
    IsLatitude,
  } from 'class-validator';
  import { Transform } from 'class-transformer';

  // con questo dto VALIDEREMO tutte le info dentro alla string di query della getEstimate
  export class GetEstimateDto {
    @IsString()
    make: string;
  
    @IsString()
    model: string;

    // rispetto a ReportDto destrutturo però l'Obj e prendo solo il valore della proprietà
    @Transform( ({value}) => parseInt(value) )
    @IsNumber()
    @Min(1930)
    @Max(2050)
    year: number;
  
    @Transform( ({value}) => parseInt(value) )
    @IsNumber()
    @Min(0)
    @Max(1000000)
    mileage: number;
  
    @Transform( ({value}) => parseFloat(value) )
    @IsLongitude()
    lng: number;
  
    @Transform( ({value}) => parseFloat(value) )
    @IsLatitude()
    lat: number;
  }
  