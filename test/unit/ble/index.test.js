/**
 * Copyright reelyActive 2015
 * We believe in an open Internet of Things
 */

var advlib = require("../../../lib/ble/index.js");
var assert = require('assert');

// Inputs for the scenario
var INPUT_DATA = '421655daba50e1fe0201050c097265656c79416374697665' ;

// Expected outputs for the scenario
var EXPECTED_DATA =  {
  type: 'ADVA-48',
  value: 'fee150bada55',
  advHeader: {
    type: 'ADV_NONCONNECT_IND',
    length: 22,
    txAdd: 'random',
    rxAdd: 'public'
  },
  advData: {
    flags: [ 'LE Limited Discoverable Mode', 'BR/EDR Not Supported' ],
      completeLocalName: 'reelyActive'
  }
}

// Stanley Black and Decker
const SBD_TAG_0_INPUT = '0201060302CEFA17FFFE00FEC472DC26D5EC0102810000AC00000000007514'.toLowerCase();
const SBD_TAG_0_EXPECTED = {

};
const SBD_DRILL_0_INPUT = '0201060302CEFA17FFFE00FE582FB6C350C501038C2808C9A10100000000FF'.toLowerCase();
const SBD_DRILL_0_EXPECTED = {

};
const SBD_IMPACT_0_INPUT = '';
const SBD_IMPACT_0_EXPECTED = {

};


describe('ble', function() {

  // Test the process function
  it('should convert a hexadecimal payload to a JSON packet', function() {
    assert.deepEqual(advlib.process(INPUT_DATA), EXPECTED_DATA);
  });

  it('SBD TAG 0', function() {
    const SBDDrill = advlib.process(SBD_TAG_0_INPUT);
    console.log('SBD TAG 0 SBD_TAG_0_INPUT=', JSON.stringify(SBD_TAG_0_INPUT, null, 2));
    console.log('SBD TAG 0', JSON.stringify(SBDDrill, null, 2));
    assert.deepEqual(SBDDrill.tag, SBD_TAG_0_EXPECTED);
  });

});