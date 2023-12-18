

var protractor = require('protractor');
var browser = protractor.browser;
var element = protractor.element;
var by = protractor.by;


describe('ListFloorsWithElevatorsComponent E2E Test', () => {

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

  it('should navigate to the List Floors of Building with Elevators page', () => {
    element(by.buttonText('List Floors of Building with Elevators')).click();
    expect(browser.getCurrentUrl()).toContain('/listFloorsWithElevators');
  });

  it('should List Floors of Building with Elevators', async () => {
    var dropdown = element(by.id('buildingCode'));
    dropdown.click();
    var desiredOption = dropdown.element(by.cssContainingText('option', 'EdifA')).click();
    element(by.buttonText('List Floors of Building with Elevators')).click();
    expect(element(by.id('server-response')).getText()).toContain('Floor:');
    
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
