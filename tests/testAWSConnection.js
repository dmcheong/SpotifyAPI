const { expect } = require('chai');
const s3 = require('../src/config/aws-config'); // Assurez-vous que le chemin est correct

describe('AWS Connection Test', () => {
  it('Ceci est un test. Lire le message précédent pour vérifier le test de connection à AWS', (done) => {
    // Vous pouvez ajouter des assertions ici pour tester la connexion
    expect(s3).to.be.an('object');
    done();
  });
});