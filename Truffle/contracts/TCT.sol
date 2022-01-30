// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@chainlink/contracts/src/v0.8/ChainlinkClient.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@opengsn/contracts/src/BaseRelayRecipient.sol";
import "./TruthToken.sol";

/**
 * THIS IS AN EXAMPLE CONTRACT WHICH USES HARDCODED VALUES FOR CLARITY.
 * PLEASE DO NOT USE THIS CODE IN PRODUCTION.
 */
struct Set {
    address[] values;
    mapping(address => bool) is_in;
}

contract TCT is ChainlinkClient, BaseRelayRecipient {
    using Chainlink for Chainlink.Request;

    address private owner;
    address private oracle;
    bytes32 private boolJobId;
    bytes32 private stringJobId;
    uint256 private fee;
    bytes32 private requestIdentifier;
    mapping(address => Set) private vouchesMap;

    TruthToken public truthTokens;

    mapping(bytes32 => address) internal requestTwitterAccountmap;
    mapping(address => string) public twitterAccountVerificationMap;

    event RequestComplete(string nftRequestString);

    constructor(address _trustedForwarder) {
        owner = msg.sender;

        setPublicChainlinkToken();
        oracle = 0xc57B33452b4F7BB189bB5AfaE9cc4aBa1f7a4FD8;
        boolJobId = "bc746611ebee40a3989bbe49e12a02b9";
        stringJobId = "7401f318127148a894c00c292e486ffd";
        fee = 0.1 * 10**18; // (Varies by network and job)

        truthTokens = new TruthToken(1614317 * 10**18); // Initial mint of Truth Tokens

        _setTrustedForwarder(_trustedForwarder);
    }
    modifier onlyOwner() {
        require(owner == msg.sender, "Only Owner can perform this operation");
        _;
    }

    // Twitter Account Verification
    function requestTwitterVerification(
        string memory _tweet,
        string memory _randid
    ) public returns (bytes32 requestId) {
        Chainlink.Request memory request = buildChainlinkRequest(
            stringJobId,
            address(this),
            this.fulfillTwitterAccountRequest.selector
        );
        request.add(
            "get",
            strConcat(
                "https://the-collective-truth.herokuapp.com/twitter/verify?randid=",
                _randid,
                "&tweet=",
                _tweet,
                ""
            )
        );
        request.add("path", "username");
        requestIdentifier = sendChainlinkRequestTo(oracle, request, fee);
        requestTwitterAccountmap[requestIdentifier] = msg.sender;
        return requestIdentifier;
    }

    function fulfillTwitterAccountRequest(bytes32 _requestId, bytes32 _username)
        public
        payable
        recordChainlinkFulfillment(_requestId)
    {
        address _user = requestTwitterAccountmap[_requestId];
        twitterAccountVerificationMap[_user] = bytes32ToString(_username); // update Twitter Account username
        truthTokens.transfer(_user, 10**19); // Joining Bonus
        emit RequestComplete("_user"); // event to be listened by the client
    }

    function getTwitterVerificationStatus(address _account)
        public
        view
        returns (string memory)
    {
        return twitterAccountVerificationMap[_account];
    }

    // Vouching for users
    function vouchUser(address _account) public payable {        
        require(
            bytes(twitterAccountVerificationMap[msg.sender]).length != 0,
            "User not verified"
        );
        require(
            vouchesMap[_account].is_in[msg.sender] == false,
            "Already vouched"
        );

        
        if (vouchesMap[_account].is_in[msg.sender] == false) {
            vouchesMap[_account].values.push(msg.sender);
            vouchesMap[_account].is_in[msg.sender] = true;
        }
    }

    function getVouches(address _account) public view returns (uint256) {
        return vouchesMap[_account].values.length;
    }

    // Truth Tokens
    function truthBalance(address _account) public view returns (uint256) {
        return truthTokens.balanceOf(_account);
    }    

    // UTILS
    function strConcat(
        string memory _a,
        string memory _b,
        string memory _c,
        string memory _d,
        string memory _e
    ) internal pure returns (string memory) {
        bytes memory _ba = bytes(_a);
        bytes memory _bb = bytes(_b);
        bytes memory _bc = bytes(_c);
        bytes memory _bd = bytes(_d);
        bytes memory _be = bytes(_e);
        string memory abcde = new string(
            _ba.length + _bb.length + _bc.length + _bd.length + _be.length
        );
        bytes memory babcde = bytes(abcde);
        uint256 k = 0;
        uint256 i = 0;
        for (i = 0; i < _ba.length; i++) babcde[k++] = _ba[i];
        for (i = 0; i < _bb.length; i++) babcde[k++] = _bb[i];
        for (i = 0; i < _bc.length; i++) babcde[k++] = _bc[i];
        for (i = 0; i < _bd.length; i++) babcde[k++] = _bd[i];
        for (i = 0; i < _be.length; i++) babcde[k++] = _be[i];
        return string(babcde);
    }

    function bytes32ToString(bytes32 _bytes32)
        internal
        pure
        returns (string memory)
    {
        uint8 i = 0;
        while (i < 32 && _bytes32[i] != 0) {
            i++;
        }
        bytes memory bytesArray = new bytes(i);
        for (i = 0; i < 32 && _bytes32[i] != 0; i++) {
            bytesArray[i] = _bytes32[i];
        }
        return string(bytesArray);
    }

    // BICONOMY
    function setTrustForwarder(address _trustedForwarder) public onlyOwner {
        _setTrustedForwarder(_trustedForwarder);
    }

    function versionRecipient() external pure override returns (string memory) {
        return "1";
    }


    function withdrawLink() external onlyOwner{        
        ERC20 tokenContract = ERC20(0xa36085F69e2889c224210F603D836748e7dC0088);
        tokenContract.transfer(
            msg.sender,
            tokenContract.balanceOf(address(this))
        );
    }
}
