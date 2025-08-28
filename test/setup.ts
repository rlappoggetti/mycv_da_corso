import { rm } from 'fs/promises';
import { join } from 'path';

global.beforeEach(async () => {
    // elimino il db test.sqlite prima di ogni test  per non trovarmi chiavi duplicate
    try {
        await rm(join(__dirname,'..','test.sqlite')); // join(parte dalla cartella corrente, va su di una, file da cancellare con la rm )
         console.log('Elimino il db di test per ricrearlo ex novo durante questo giro di test')
    
    }
    catch (error) {
     // mi basta solo che se non trava il db da cancellare non faccia niente
    }
});