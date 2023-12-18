

var protractor = require('protractor');
var browser = protractor.browser;
var element = protractor.element;
var by = protractor.by;


describe('UpdateBuildingComponent E2E Test', () => {

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

  it('should navigate to the building menu page', () => {
    element(by.buttonText('Building Menu')).click();
    expect(browser.getCurrentUrl()).toContain('/building');
  });

  it('should navigate to the update building page', () => {
    element(by.buttonText('Edit Building')).click();
    expect(browser.getCurrentUrl()).toContain('/updateBuilding');
  });

  it('should update building and set server response on successful update', async () => {
    var dropdown = element(by.id('code'));
    dropdown.click();
    var desiredOption = dropdown.element(by.cssContainingText('option', 'edif2')).click();
    element(by.id('name')).sendKeys('Building 123');
    element(by.id('description')).sendKeys('Updated description');
    element(by.id('width')).sendKeys('50');
    element(by.id('length')).sendKeys('75');
    element(by.buttonText('Update')).click();
    expect(element(by.id('server-response')).getText()).toContain('Building Updated:');
    
  });

  it('should navigate to /building when go back to building Menu is called', async () => {
    await element(by.buttonText('Back to Menu')).click();
    expect(await browser.getCurrentUrl()).toContain('/building');
  });

  it('should navigate to /startMenu when goToHome is called', async () => {
    await element(by.css('.home-button')).click();
    expect(await browser.getCurrentUrl()).toContain('/startMenu');
  });
  
});
