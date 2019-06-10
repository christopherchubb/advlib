
module.exports.process = (data) => {
  const tag = {};
  const dataArray = new Uint8Array(data.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));
  const statusBinArray = dataArray[2].toString(2);
  tag.commissioned = (statusBinArray[7] === '1');
  tag.buttonPushed = (statusBinArray[6] === '1');

  if (tag.commissioned) {
    tag.identifyActive = (statusBinArray[5] === '1'); // 0 = IDENTIFY not active, 1 = IDENTIFY is active
    const coinCell = statusBinArray[4]+statusBinArray[3];
    switch (coinCell) {
      case '00':
        tag.coinCellHealth = 'Excellent'; break;
      case '00':
        tag.coinCellHealth = 'Good'; break;
      case '00':
        tag.coinCellHealth = 'Fair'; break;
      case '00':
        tag.coinCellHealth = 'Poor'; break;
      default:
    }
    tag.publicMessageAvailable = (statusBinArray[2] === '1'); // [2] 0 = no PUBLIC MESSAGE in mailbox, 1 = PUBLIC MESSAGE in mailbox
    tag.privateMessageAvailable = (statusBinArray[1] === '1'); // [1] 0 = no PRIVATE MESSAGE in mailbox, 1 = PRIVATE MESSAGE in mailbox
    tag.platform = (statusBinArray[1] === '0' ? 'iOS' : 'Android'); // [0] 0 = iOS, 1 = ANDROID

    tag.coinCellVoltage = dataArray[5] / 59.5;
    tag.temperature = dataArray[11] - 40; // degrees F
    tag.advertisementRate = dataArray[12] * 100; // milliseconds
  }

  return tag;
}