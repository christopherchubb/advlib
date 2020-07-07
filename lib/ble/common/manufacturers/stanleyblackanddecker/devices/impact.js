const common = require('./common');

module.exports.process = (data) => {
  const out = {};
  const dataArray = new Uint8Array(data.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));

  if (dataArray[1] !== 4) throw new Error('Not an SBD Driver!');
  switch (dataArray[0]) {
    case 1:
      out.model = 'DCF888';
      break;
    default:
  }

  const statusLSBBinArray = dataArray[2].toString(2);
  out.commissioned = (statusLSBBinArray[7] === '1');
  out.buttonPushed = (statusLSBBinArray[6] === '1');

  if (out.commissioned) {
    out.disabledByTether = (statusLSBBinArray[0] === '1'); // [0] Disabled by Tether, 1 = disabled
    out.disabledByLoan = (statusLSBBinArray[1] === '1'); // [1] Disabled by Loan, 1 = disabled
    out.globalEnable = (statusLSBBinArray[2] === '1'); // [2] Global Enable, 1 = enabled (current enable/disable state)
    out.firmwareControlledEnable = (statusLSBBinArray[3] === '1'); // [3] Firmware controlled enable, 1 = enabled
    out.warningActive = (statusLSBBinArray[4] === '1'); // [4] Warning Timeout, 1 = warning active
    out.messageActive = (statusLSBBinArray[5] === '1'); // [5] 0 = no message, 1 = message

    const statusMSBBinArray = dataArray[3].toString(2);
    Object.assign(out, common.statusMSBDrillDriver(statusMSBBinArray));

    const status2BinArray = dataArray[4].toString(2);
    out.iBeaconing = (status2BinArray[3] === '1'); // [3] 0 = not iBeaconing, 1 = is iBeaconing
    // [2],[1] coin cell health, 00= excellent, 01=good, 10=fair, 00=poor
    out.coinCellHealth = common.coinCellHealth(status2BinArray[2]+status2BinArray[1]);

    out.platform = (status2BinArray[0] === '0' ? 'iOS' : 'Android'); // [0] 0 = iOS, 1 = ANDROID

    out.batteryVoltage = dataArray[5] / 10.0;
    out.coinCellVoltage = dataArray[6] / 59.5;

    // FADE_STOP_MODE
    out.fadeStopMode = common.fadeStopMode(dataArray[8].toString(2));


    out.modeKey = (dataArray[9] * 256) + dataArray[10];
    out.secondsTillDisconnect = (dataArray[11] === 255 ? null : dataArray[11]);

  }

  return out;
}