
module.exports.coinCellHealth = (coinCellBytes) => {

  switch (coinCellBytes) {
    case '00':
      return 'Excellent';
    case '01':
        return 'Good';
    case '10':
        return 'Fair';
    case '11':
        return 'Poor';
    default:
      return null;
  }
};

module.exports.statusMSBDrillDriver = (statusMSBBinArray) => {
  return {
    loaned: (statusMSBBinArray[0] === '1'), // [0] Loaned, 1 = loaned
    SBS_P_STATE: (statusMSBBinArray[1] === '1'), // [1] SBS_P_STATE
    SBS_R_STATE: (statusMSBBinArray[2] === '1'), // [2] SBS_R_STATE
    SBS_S_STATE: (statusMSBBinArray[3] === '1'), // [3] SBS_S_STATE
    SBS_L_STATE: (statusMSBBinArray[4] === '1'), // [4] SBS_L_STATE
    powerToolBattery: (statusMSBBinArray[5] === '1'), // [5] 0 = no power tool battery, 1 = power tool battery
    tethered: (statusMSBBinArray[6] === '1'), // [6] 0 = not tethered, 1 = tethered
    HOT_CELL_LED_FADE: (statusMSBBinArray[7] === '1'), // [7] 0 = not HOT_CELL_LED_FADE, 1 = HOT_CELL_LED_FADE
  };
};

/**
 * Decode mode
  0xX0 = default MODE
  0xX1 = MODE 1 selected
  0xX2 = MODE 2 selected
  0xX4 = MODE 3 selected
  0xX8 = MODE 4 selected
  0x8X = CONFIGURATION_MODE_RECEPTIVE active
        configuration is requested by app during a direct connection.
        onde in this mode, need to hold button down for 3 seconds and an acknoledge at the tool
        enter CONFIGURATION_MODE_RECEPTIVE active with bit asserted.
  0x4X = DIRECT_CONNECTION_ACTIVE active
        app deceides whether a direct connection with non-connectable advertisements needs to occur
 */
module.exports.activeMode = (mode) => {
  return {
    MODE1: mode & 0x01,
    MODE2: mode & 0x02,
    MODE3: mode & 0x04,
    MODE4: mode & 0x08,
    CONFIGURATION_MODE_RECEPTIVE: mode & 0x80,
    DIRECT_CONNECTION_ACTIVE: mode & 0x40,
  };
};

module.exports.fadeStopMode = (statusFSMBinArray) => {
  return {
    motorTempStop: (statusFSMBinArray[5] === '1'),
    motorTempFade: (statusFSMBinArray[4] === '1'),
    batteryTempStop: (statusFSMBinArray[3] === '1'),
    batteryTempFade: (statusFSMBinArray[2] === '1'),
    voltageStop: (statusFSMBinArray[1] === '1'),
    voltageFade: (statusFSMBinArray[0] === '1'),
  };
};