/**
 * Copyright reelyActive 2015
 * We believe in an open Internet of Things
 */

var tag = require('./devices/tag');
var impact = require('./devices/impact');
var drill = require('./devices/drill');

/**
 * Parse BLE advertiser manufacturer specific data for StickNFind.
 * @param {Object} advertiserData The object containing all parsed data.
 */
function process(advertiserData) {
  var data = advertiserData.manufacturerSpecificData.data.substr(14);
  console.log('sbd process. advertiserData=', JSON.stringify(advertiserData, null, 2), 'data=', data);
  if (data.substr(0,4) === '0102') {
    advertiserData.manufacturerSpecificData.type = 'tag';
    advertiserData.manufacturerSpecificData.tag = tag.process(data);
  } else if (data.substr(2,2) === '03') {
    advertiserData.manufacturerSpecificData.type = 'drill';
    advertiserData.manufacturerSpecificData.impact = drill.process(data);
  } else if (data.substr(2,2) === '04') {
    advertiserData.manufacturerSpecificData.type = 'impact';
    advertiserData.manufacturerSpecificData.impact = impact.process(data);
  } else {
    console.log('SBD Process: Unable to find device type');
  }

}


module.exports.process = process;