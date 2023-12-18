exports.config = {
  framework: 'jasmine', //Type of Framework used
  chromeDriver:'./../../chromedriver-win64/chromedriver.exe',
  specs: ['./tests/app.e2e.ts', './tests/update-building.e2e.ts', './tests/update-floor.e2e.ts','./tests/update-elevator.e2e.ts','./tests/list-floors-with-elevators.e2e.ts'], //Name of the Specfile
}
