
var protractor = require('protractor');
var browser = protractor.browser;
var element = protractor.element;

// spec.js
describe('AngularJS Homepage', function() {
  it('should have a title', function() {
    browser.get('https://angularjs.org');

    expect(browser.getTitle()).toEqual('AngularJS — Superheroic JavaScript MVW Framework');
  });
});

