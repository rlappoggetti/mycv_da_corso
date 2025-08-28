var dbConfig = {
    synchronize: false
};

// assegno le varie configurazioni di TypeOrm a seconda dell'ambiente
switch (process.env.NODE_ENV) {
    case 'development':
      console.log('passo da development');
      Object.assign(dbConfig, {
        type: 'sqlite',
        database: 'db.sqlite',
        entities: ['**/*.entity.js'], // cerco dappertutto tutti i file delle entità 
        // Li trova  nella cartella dist che contiene la versione .js dei  file .ts
      });
      break;
    case 'test':
      Object.assign(dbConfig, {
        type: 'sqlite',
        database: 'test.sqlite',
        entities: ['**/*.entity.ts'],
      });
      break;
    case 'production':
      break;
    default:
      throw new Error('unknown environment');
  }

module.exports = dbConfig;