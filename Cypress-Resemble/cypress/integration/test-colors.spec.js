var i = 0;
// var caso = 1;
var caso = 2;
// var type = 'after';
var type = 'befor';
context(`Caso ${caso} de prueba`, () => {
    beforeEach(() => {
    //   cy.visit('https://misoharoldfuneme.github.io/Taller-VRT-Harold-/');
      cy.visit('https://monitor177.github.io/color-palette/');
    i = i +1;
    });
  
    it('click generar paleta de 5 colores obligatoria', () => {
      cy.get('button[id=generate]').click();
      cy.wait(3000)
      if (type === 'after') {
          cy.screenshot(`caso${caso}/Step-After-${i}`);
      }else{
          cy.screenshot(`caso${caso}/Step-Before-${i}`);
      }
    })
    
    it('click limpiar paleta de colores', () => {
        cy.get('button[id=clean]').click();
        cy.wait(3000)
        if (type === 'after') {
            cy.screenshot(`caso${caso}/Step-After-${i}`);
        }else{
            cy.screenshot(`caso${caso}/Step-Before-${i}`);
        }
    })
  })