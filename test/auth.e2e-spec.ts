import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('Authentication System', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('Gestisce una richiesta di Sign up', () => {
    const email = 'abderrrt@gmail.com';
    return request(app.getHttpServer())
      .post('/auth/signup')
      .send({email,password:'abc34f12'})
      .expect(201)
      .then((res) => {
        const{id, email} = res.body;
        expect(id).toBeDefined();
        expect(email).toEqual(email);
      }
    )
  });


  it('signup as a new user then get the currently logged in user', async () => {
    const email = 'asdf@asdf.com';
// ho bisogno di mettermi la risposta in un mio oggetto di comodo che qui chiamo "res" ...
    const res = await request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email, password: 'asdf' })
      .expect(201);
// ... per poi ricavarne il cookie e memorizzarmelo, perchè non è gestito dalla libreria di test
// quindi neanche nella chiamata che segue
    const cookie = res.get('Set-Cookie');
// destrutturo la request che segue prendendo solo il body
    const { body } = await request(app.getHttpServer())
      .get('/auth/whoami')
      .set('Cookie', cookie)
      .expect(200);

    expect(body.email).toEqual(email);
    
  });
});
