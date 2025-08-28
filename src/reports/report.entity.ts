import { 
  Entity, 
  Column, 
  PrimaryGeneratedColumn, 
  ManyToOne 
} from 'typeorm';

import { User } from '../users/user.entity';

@Entity()
export class Report {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({default:false})
  approved:boolean;

  @Column()
  price: number;

  @Column()
  make: string;

  @Column()
  model: string;

  @Column()
  year: number;

  @Column()
  lng: number;

  @Column()
  lat: number;

  @Column()
  mileage: number;

  // Parametro1 : Entità madre (One) con cui c'è la relazione
  // Parametro2 : Campo dell'istanza dell'entità madre che contiene / si relazionacon l'entità figlia (Many) 
  // Entrambi vengono ricavati da una funzione per questioni di dipendenza circolare
  // Questo decoratore causa un cambiamento nel db: aggiunge lo user_id nella tabella Report (in sostanza la FK)
  // che associa il Report all'Utente 
  @ManyToOne(() => User, (user) => user.reports)
  user:User;
}
