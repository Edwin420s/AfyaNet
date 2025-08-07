// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/access/Ownable.sol";

contract HospitalRegistry is Ownable {
    struct HospitalInfo {
        string name;
        string physicalAddress;
        string accreditationId;
        string publicKey;
        bool isActive;
    }
    
    address[] public hospitalAddresses;
    mapping(address => HospitalInfo) public hospitals;
    
    event HospitalRegistered(address indexed hospitalAddress, string name);
    event HospitalUpdated(address indexed hospitalAddress, string field);
    event HospitalStatusChanged(address indexed hospitalAddress, bool isActive);

    function registerHospital(
        address hospitalAddress,
        string memory name,
        string memory physicalAddress,
        string memory accreditationId,
        string memory publicKey
    ) external onlyOwner {
        require(hospitals[hospitalAddress].accreditationId.length == 0, "Hospital already registered");
        
        hospitals[hospitalAddress] = HospitalInfo({
            name: name,
            physicalAddress: physicalAddress,
            accreditationId: accreditationId,
            publicKey: publicKey,
            isActive: true
        });
        
        hospitalAddresses.push(hospitalAddress);
        emit HospitalRegistered(hospitalAddress, name);
    }

    function updateHospitalInfo(
        address hospitalAddress,
        string memory field,
        string memory value
    ) external onlyOwner {
        require(hospitals[hospitalAddress].accreditationId.length > 0, "Hospital not registered");
        
        if (keccak256(bytes(field)) == keccak256(bytes("name"))) {
            hospitals[hospitalAddress].name = value;
        } else if (keccak256(bytes(field)) == keccak256(bytes("physicalAddress"))) {
            hospitals[hospitalAddress].physicalAddress = value;
        } else if (keccak256(bytes(field)) == keccak256(bytes("publicKey"))) {
            hospitals[hospitalAddress].publicKey = value;
        } else {
            revert("Invalid field");
        }
        
        emit HospitalUpdated(hospitalAddress, field);
    }

    function setHospitalStatus(address hospitalAddress, bool isActive) external onlyOwner {
        require(hospitals[hospitalAddress].accreditationId.length > 0, "Hospital not registered");
        hospitals[hospitalAddress].isActive = isActive;
        emit HospitalStatusChanged(hospitalAddress, isActive);
    }

    function getRegisteredHospitals() external view returns (address[] memory) {
        return hospitalAddresses;
    }

    function getHospitalCount() external view returns (uint256) {
        return hospitalAddresses.length;
    }

    function verifyHospital(address hospitalAddress, bytes32 hash, bytes memory signature) 
        external 
        view 
        returns (bool) 
    {
        require(hospitals[hospitalAddress].isActive, "Hospital not active");
        return keccak256(abi.encodePacked(hash, hospitals[hospitalAddress].publicKey)) == 
            keccak256(abi.encodePacked(signature));
    }
}