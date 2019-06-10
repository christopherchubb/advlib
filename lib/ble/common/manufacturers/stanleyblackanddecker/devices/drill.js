const common = require('./common');

module.exports.process = (data) => {
  const out = {};
  const dataArray = new Uint8Array(data.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));

  if (dataArray[1] !== 3) throw new Error('Not an SBD Drill!');
  switch (dataArray[0]) {
    case 1:
      out.model = 'DCD791BT';
      out.description = 'Drill Driver';
      break;
    case 2:
      out.model = 'DCD991BT';
      out.description = 'Premium Drill Driver';
      break;
    case 3:
      out.model = 'DCD796BT';
      out.description = 'Hammer Drill';
      break;
    case 4:
      out.model = 'DCD996BT';
      out.description = 'Premium Hammer Drill';
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

    const statusMSBBinArray = dataArray[3].toString(2);
    Object.assign(out, common.statusMSBDrillDriver(statusMSBBinArray));

    const status2BinArray = dataArray[4].toString(2);
    out.iBeaconing = (status2BinArray[3] === '1'); // [3] 0 = not iBeaconing, 1 = is iBeaconing

    out.batteryVoltage = dataArray[5] / 10.0;
    out.coinCellVoltage = dataArray[6] / 59.5;

    out.activeMode = common.activeMode(dataArray[7]);

    // FADE_STOP_MODE
    out.fadeStopMode = common.fadeStopMode(dataArray[8].toString(2));

    out.clutchSetting = dataArray[9];

    out.modeKey = (dataArray[10] * 256) + dataArray[11];
    out.secondsTillDisconnect = (dataArray[12] === 255 ? null : dataArray[11]);

  }

  return out;
}