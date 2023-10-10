// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract EtherForwarder {
    address public owner;
    address public destination;

    constructor(address _destination) {
        owner = msg.sender;
        destination = _destination;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    receive() external payable {
        // Ensure the contract has received some Ether
        require(msg.value > 0, "No Ether sent");

        // Forward the received Ether to the destination address
        (bool success, ) = payable(destination).call{value: msg.value}("");
        require(success, "Failed to forward Ether");

        emit EtherForwarded(destination, msg.value);
    }

    function changeDestination(address newDestination) public onlyOwner {
        destination = newDestination;
    }

    event EtherForwarded(address indexed to, uint256 amount);
}
