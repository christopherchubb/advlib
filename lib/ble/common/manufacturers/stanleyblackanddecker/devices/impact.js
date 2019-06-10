
module.exports.process = (data) => {
  const impact = {};
  const dataArray = new Uint8Array(data.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));
  const statusLSBBinArray = dataArray[2].toString(2);
  impact.commissioned = (statusLSBBinArray[7] === '1');
  impact.buttonPushed = (statusLSBBinArray[6] === '1');

  if (impact.commissioned) {
    impact.disabledByTether = (statusLSBBinArray[0] === '1'); // [0] Disabled by Tether, 1 = disabled
    impact.disabledByLoan = (statusLSBBinArray[1] === '1'); // [1] Disabled by Loan, 1 = disabled
    impact.globalEnable = (statusLSBBinArray[2] === '1'); // [2] Global Enable, 1 = enabled (current enable/disable state)
    impact.firmwareControlledEnable = (statusLSBBinArray[3] === '1'); // [3] Firmware controlled enable, 1 = enabled
    impact.warningActive = (statusLSBBinArray[4] === '1'); // [4] Warning Timeout, 1 = warning active
    impact.messageActive = (statusLSBBinArray[5] === '1'); // [5] 0 = no message, 1 = message

    const statusMSBBinArray = dataArray[3].toString(2);
    impact.loaned = (statusMSBBinArray[0] === '0'); // [0] Loaned, 1 = loaned
    impact.SBS_P_STATE = (statusMSBBinArray[0] === '1'); // [1] SBS_P_STATE
    impact.SBS_R_STATE = (statusMSBBinArray[0] === '2'); // [2] SBS_R_STATE
    impact.SBS_S_STATE = (statusMSBBinArray[0] === '3'); // [3] SBS_S_STATE
    impact.SBS_L_STATE = (statusMSBBinArray[0] === '4'); // [4] SBS_L_STATE
    impact.powerToolBattery = (statusMSBBinArray[0] === '5'); // [5] 0 = no power tool battery, 1 = power tool battery
    impact.tethered = (statusMSBBinArray[0] === '6'); // [6] 0 = not tethered, 1 = tethered
    impact.HOT_CELL_LED_FADE = (statusMSBBinArray[0] === '7'); // [7] 0 = not HOT_CELL_LED_FADE, 1 = HOT_CELL_LED_FADE


    const status2BinArray = dataArray[4].toString(2);
    impact.iBeaconing = (status2BinArray[3] === '0'); // [3] 0 = not iBeaconing, 1 = is iBeaconing
    // [2],[1] coin cell health, 00= excellent, 01=good, 10=fair, 00=poor
    const coinCell = status2BinArray[2]+status2BinArray[1];
    switch (coinCell) {
      case '00':
        impact.coinCellHealth = 'Excellent'; break;
      case '00':
        impact.coinCellHealth = 'Good'; break;
      case '00':
        impact.coinCellHealth = 'Fair'; break;
      case '00':
        impact.coinCellHealth = 'Poor'; break;
      default:
    }
    impact.platform = (status2BinArray[0] === '0' ? 'iOS' : 'Android'); // [0] 0 = iOS, 1 = ANDROID

    impact.batteryVoltage = dataArray[5] / 10.0;
    impact.coinCellVoltage = dataArray[6] / 59.5;

    // FADE_STOP_MODE
    const statusFSMBinArray = dataArray[8].toString(2);
    impact.fadeStopMode = {
      motorTempStop: (statusFSMBinArray[5] === '1'),
      motorTempFade: (statusFSMBinArray[4] === '1'),
      batteryTempStop: (statusFSMBinArray[3] === '1'),
      batteryTempFade: (statusFSMBinArray[2] === '1'),
      voltageStop: (statusFSMBinArray[1] === '1'),
      voltageFade: (statusFSMBinArray[0] === '1'),
    };

    impact.modeKey = (dataArray[9] * 256) + dataArray[10];
    impact.secondsTillDisconnect = (dataArray[11] === 255 ? null : dataArray[11]);

  }

  return impact;
}