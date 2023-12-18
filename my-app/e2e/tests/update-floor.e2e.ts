

var protractor = require('protractor');
var browser = protractor.browser;
var element = protractor.element;
var by = protractor.by;


describe('UpdateFloorComponent E2E Test', () => {

  it('should navigate to the login page', () => {
    browser.get('http://localhost:4200');
    element(by.css('button')).click();
    expect(browser.getCurrentUrl()).toContain('/login');
  });

  it('should navigate to the start menu', () => {
    element(by.id('email')).sendKeys('1211705@gmail.com');
    element(by.id('password')).sendKeys('123456q');
    element(by.buttonText('Confirm')).click();
    expect(browser.getCurrentUrl()).toContain('/startMenu');
  });

  it('should navigate to the gestao de camous menu page', () => {
    element(by.buttonText('Gestão de Campus Menu')).click();
    expect(browser.getCurrentUrl()).toContain('/menuGestorDeCampus');
  });

  it('should navigate to the floor menu page', () => {
    element(by.buttonText('Floor Menu')).click();
    expect(browser.getCurrentUrl()).toContain('/floor');
  });

  it('should navigate to the update floor page', () => {
    element(by.buttonText('Edit Floor')).click();
    expect(browser.getCurrentUrl()).toContain('/updateFloor');
  });

  it('should update floor and set server response on successful update', async () => {
    var dropdown = element(by.id('buildingCode'));
    dropdown.click();
    // Obter todas as opções do dropdown
    var options = element.all(by.css('#buildingCode option'));
    // Selecionar a segunda opção pelo índice (índice 1, já que os índices começam em 0)
    options.get(0).click();

    var dropdown2 = element(by.id('name'));
    dropdown2.click();
    // Obter todas as opções do segundo dropdown
    var options2 = element.all(by.css('#name option'));
    // Selecionar a segunda opção pelo índice
    options2.get(1).click();
    //element(by.id('description')).sendKeys('Updated description');
    element(by.buttonText('Update')).click();
    //expect(element(by.id('server-response')).getText()).toContain('Description: Updated description');
    expect(element(by.id('server-response')).getText()).toContain('Floor:');
    expect(element(by.id('server-response')).getText()).toContain('Building Code:');
  });

  it('should navigate to /floor when go back to floor Menu is called', async () => {
    await element(by.buttonText('Back to Menu')).click();
    expect(await browser.getCurrentUrl()).toContain('/floor');
  });

  it('should navigate to /startMenu when goToHome is called', async () => {
    await element(by.css('.home-button')).click();
    expect(await browser.getCurrentUrl()).toContain('/startMenu');
  });

});
