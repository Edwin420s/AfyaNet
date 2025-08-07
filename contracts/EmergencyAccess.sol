// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

contract EmergencyAccess is Ownable {
    using ECDSA for bytes32;

    struct EmergencyRequest {
        address requester;
        address patient;
        uint256 timestamp;
        uint256 expiry;
        bool approved;
        string reason;
        bytes medicalAuthorization;
    }
    
    mapping(address => bool) private _emergencyResponders;
    mapping(address => EmergencyRequest[]) private _patientEmergencies;
    
    event EmergencyAccessRequested(address indexed patient, address requester, string reason);
    event EmergencyAccessApproved(address indexed patient, address requester);
    event EmergencyAccessRevoked(address indexed patient, address requester);
    event ResponderAdded(address indexed responder);
    event ResponderRemoved(address indexed responder);

    modifier onlyResponder() {
        require(_emergencyResponders[msg.sender], "Caller is not an emergency responder");
        _;
    }

    function requestEmergencyAccess(
        address patient,
        uint256 duration,
        string memory reason,
        bytes memory medicalAuthorization
    ) external onlyResponder {
        _patientEmergencies[patient].push(EmergencyRequest({
            requester: msg.sender,
            patient: patient,
            timestamp: block.timestamp,
            expiry: block.timestamp + duration,
            approved: false,
            reason: reason,
            medicalAuthorization: medicalAuthorization
        }));
        
        emit EmergencyAccessRequested(patient, msg.sender, reason);
    }

    function approveEmergencyAccess(address responder) external {
        EmergencyRequest[] storage requests = _patientEmergencies[msg.sender];
        for (uint i = 0; i < requests.length; i++) {
            if (requests[i].requester == responder && !requests[i].approved) {
                requests[i].approved = true;
                emit EmergencyAccessApproved(msg.sender, responder);
                break;
            }
        }
    }

    function revokeEmergencyAccess(address requester) external {
        EmergencyRequest[] storage requests = _patientEmergencies[msg.sender];
        for (uint i = 0; i < requests.length; i++) {
            if (requests[i].requester == requester && requests[i].approved) {
                requests[i].expiry = block.timestamp;
                emit EmergencyAccessRevoked(msg.sender, requester);
                break;
            }
        }
    }

    function hasEmergencyAccess(address patient, address requester) 
        external 
        view 
        returns (bool) 
    {
        EmergencyRequest[] storage requests = _patientEmergencies[patient];
        for (uint i = 0; i < requests.length; i++) {
            if (requests[i].requester == requester && 
                requests[i].approved && 
                requests[i].expiry > block.timestamp) {
                return true;
            }
        }
        return false;
    }

    function addResponder(address responder) external onlyOwner {
        _emergencyResponders[responder] = true;
        emit ResponderAdded(responder);
    }

    function removeResponder(address responder) external onlyOwner {
        _emergencyResponders[responder] = false;
        emit ResponderRemoved(responder);
    }

    function isResponder(address account) external view returns (bool) {
        return _emergencyResponders[account];
    }

    function getActiveEmergencies(address patient) 
        external 
        view 
        returns (EmergencyRequest[] memory) 
    {
        EmergencyRequest[] storage allRequests = _patientEmergencies[patient];
        uint activeCount = 0;
        
        for (uint i = 0; i < allRequests.length; i++) {
            if (allRequests[i].expiry > block.timestamp) {
                activeCount++;
            }
        }
        
        EmergencyRequest[] memory activeRequests = new EmergencyRequest[](activeCount);
        uint index = 0;
        
        for (uint i = 0; i < allRequests.length; i++) {
            if (allRequests[i].expiry > block.timestamp) {
                activeRequests[index] = allRequests[i];
                index++;
            }
        }
        
        return activeRequests;
    }
}