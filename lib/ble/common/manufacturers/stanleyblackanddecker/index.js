/**
 * Copyright reelyActive 2015
 * We believe in an open Internet of Things
 */

var tag = require('./devices/tag');
var impact = require('./devices/impact');

/**
 * Parse BLE advertiser manufacturer specific data for StickNFind.
 * @param {Object} advertiserData The object containing all parsed data.
 */
function process(advertiserData) {
  var data = advertiserData.manufacturerSpecificData.data;
  var packetType = advertiserData.substr(0,4);

  switch(packetType) {
    case '0102':
      advertiserData.manufacturerSpecificData.type = 'tag';
      advertiserData.manufacturerSpecificData.tag = tag.process(advertiserData);
      break;
    case '0104':
      advertiserData.manufacturerSpecificData.type = 'impact';
      advertiserData.manufacturerSpecificData.impact = impact.process(advertiserData);
      break;
    default:
  }
}


module.exports.process = process;