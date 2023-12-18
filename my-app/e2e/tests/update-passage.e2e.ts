var protractor = require('protractor');
var browser = protractor.browser;
var element = protractor.element;
var by = protractor.by;

describe('UpdatePassageComponent E2E Test', () => {

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

    it('should navigate to the gestao de campus menu page', () => {
        element(by.buttonText('Gestão de Campus Menu')).click();
        expect(browser.getCurrentUrl()).toContain('/menuGestorDeCampus');
      });

    it('should navigate to the passage page', () => {
        element(by.id('passage')).click();
        expect(browser.getCurrentUrl()).toContain('/passage');
    });

    it('should navigate to the update passage page', () => {
        element(by.id('update-passage')).click();
        expect(browser.getCurrentUrl()).toContain('/updatePassage');
    });

    it('should update passage and set server response on successful update', async () => {
        var dropdown = element(by.id('codigo'));
        dropdown.click();
        var desiredOption = dropdown.element(by.cssContainingText('option', 'pass3')).click();
        element(by.id('codeBuilding1')).sendKeys('EdifB');
        element(by.id('codeBuilding2')).sendKeys('EdifC');
        element(by.id('FloorBuilding1Name')).sendKeys('floor0edB');
        element(by.id('FloorBuilding2Name')).sendKeys('floor1edC');
        element(by.buttonText('Update')).click();
        expect(element(by.id('server-response')).getText()).toContain('Passage Updated:');
    });

    it('should navigate to /passage when go back to passage Menu is called', async () => {
        await element(by.buttonText('Back to Menu')).click();
        expect(await browser.getCurrentUrl()).toContain('/passage');
    });

    it('should navigate to /startMenu when goToHome is called', async () => {
        await element(by.css('.home-button')).click();
        expect(await browser.getCurrentUrl()).toContain('/startMenu');
    });
});