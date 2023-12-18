

var protractor = require('protractor');
var browser = protractor.browser;
var element = protractor.element;
var by = protractor.by;


describe('UpdateelevatorComponent E2E Test', () => {

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

  it('should navigate to the elevator menu page', () => {
    element(by.buttonText('Elevator Menu')).click();
    expect(browser.getCurrentUrl()).toContain('/elevator');
  });

  it('should navigate to the update elevator page', () => {
    element(by.buttonText('Edit Elevator')).click();
    expect(browser.getCurrentUrl()).toContain('/updateElevator');
  });

  it('should update elevator and set server response on successful update', async () => {
    var dropdown = element(by.id('BuildingCode'));
    dropdown.click();
    var desiredOption = dropdown.element(by.cssContainingText('option', 'edif2')).click();
    element(by.id('ElevatorCode')).sendKeys('elevator 123');
    element(by.id('marca')).sendKeys('up');
    element(by.id('modelo')).sendKeys('toHeavens');
    element(by.id('FloorsAttended')).sendKeys('0');
    element(by.id('NumSerie')).sendKeys('123456');
    element(by.id('Description')).sendKeys('Updated description');
    element(by.buttonText('Update')).click();
    expect(element(by.id('server-response')).getText()).toContain('Elevator Updated:');
    
  });

  it('should navigate to /elevator when go back to elevator Menu is called', async () => {
    await element(by.buttonText('Back to Menu')).click();
    expect(await browser.getCurrentUrl()).toContain('/elevator');
  });

  it('should navigate to /startMenu when goToHome is called', async () => {
    await element(by.css('.home-button')).click();
    expect(await browser.getCurrentUrl()).toContain('/startMenu');
  });
  
});
