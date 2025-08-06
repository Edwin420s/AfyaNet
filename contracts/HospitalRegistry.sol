// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/access/Ownable.sol";

contract HospitalRegistry is Ownable {
    struct Hospital {
        string name;
        string physicalAddress;
        string registrationNumber;
        bool isActive;
    }

    mapping(address => Hospital) public hospitals;
    address[] public hospitalAddresses;

    event HospitalRegistered(address indexed hospitalAddress, string name);
    event HospitalStatusChanged(address indexed hospitalAddress, bool isActive);

    constructor() Ownabe () {}

    function registerHospital(
        address _hospitalAddress,
        string memory _name,
        string memory _physicalAddress,
        string memory _registrationNumber
    ) external onlyOwner {
        hospitals[_hospitalAddress] = Hospital({
            name: _name,
            physicalAddress: _physicalAddress,
            registrationNumber: _registrationNumber,
            isActive: true
        });
        hospitalAddresses.push(_hospitalAddress);

        emit HospitalRegistered(_hospitalAddress, _name);
    }

    function setHospitalStatus(address _hospitalAddress, bool _isActive) external onlyOwner {
        hospitals[_hospitalAddress].isActive = _isActive;
        emit HospitalStatusChanged(_hospitalAddress, _isActive);
    }

    function getHospitals() external view returns (address[] memory) {
        return hospitalAddresses;
    }
}