// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract SimpleStorage {
    // saya ingin menyimpan sebuah nilai dalam bentuk uint256
    uint256 private storedValue;

   
    address public owner;

  
    event ValueUpdated(uint256 newValue);
    event OwnerSet(address indexed newOwner);

    
    constructor() {
        owner = msg.sender;
        emit OwnerSet(owner);
    }

    // simpan nilai ke blockchain(write)
    function setValue(uint256 _value) public {
        storedValue = _value;
        emit ValueUpdated(_value);
    }

    // membaca nilai dari blockchain(read) terakhir kali update
    function getValue() public view returns (uint256) {
        return storedValue;
    }
}
