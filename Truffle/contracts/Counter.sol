// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@opengsn/contracts/src/BaseRelayRecipient.sol";

contract Counter is BaseRelayRecipient {
    uint256 public value;

    function increase() public {
        value += 1;
    }

    // function getGasLimits()
    // external
    // view
    // returns (
    //     GasLimits memory limits
    // );

    // function preRelayedCall(
    //     GsnTypes.RelayRequest relayRequest,
    //     bytes approvalData,
    //     uint256 maxPossibleGas
    // )
    // external
    // returns (
    //     bytes memory context,
    //     bool rejectOnRecipientRevert
    // );

    // function postRelayedCall(
    //     bytes context,
    //     bool success,
    //     bytes32 preRetVal,
    //     uint256 gasUseWithoutPost,
    //     GsnTypes.RelayData calldata relayData
    // ) external;
}