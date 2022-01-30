const TCT = artifacts.require("TCT");
const biconomyForwarder = require("../list/biconomyForwarder.json");

module.exports = function (deployer, network) {
  const getBiconomyForwarderByNetwork = biconomyForwarder[network];
  if (getBiconomyForwarderByNetwork) {
    deployer.deploy(TCT, getBiconomyForwarderByNetwork);
  } else {
    console.log("No Biconomy Forwarder Found in the desired network!");
  }
};
