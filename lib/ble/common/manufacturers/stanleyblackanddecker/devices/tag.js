const common = require('./common');

module.exports.process = (data) => {
  const out = {};
  const dataArray = new Uint8Array(data.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));
  const statusBinArray = dataArray[2].toString(2);
  out.commissioned = (statusBinArray[7] === '1');
  out.buttonPushed = (statusBinArray[6] === '1');

  if (out.commissioned) {
    out.identifyActive = (statusBinArray[5] === '1'); // 0 = IDENTIFY not active, 1 = IDENTIFY is active
    out.coinCellHealth = common.coinCellHealth(statusBinArray[4]+statusBinArray[3]);
    out.publicMessageAvailable = (statusBinArray[2] === '1'); // [2] 0 = no PUBLIC MESSAGE in mailbox, 1 = PUBLIC MESSAGE in mailbox
    out.privateMessageAvailable = (statusBinArray[1] === '1'); // [1] 0 = no PRIVATE MESSAGE in mailbox, 1 = PRIVATE MESSAGE in mailbox
    out.platform = (statusBinArray[1] === '0' ? 'iOS' : 'Android'); // [0] 0 = iOS, 1 = ANDROID

    out.coinCellVoltage = dataArray[5] / 59.5;
    out.temperature = dataArray[11] - 40; // degrees F
    out.advertisementRate = dataArray[12] * 100; // milliseconds
  }

  return out;
}