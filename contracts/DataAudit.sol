// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/access/Ownable.sol";

contract DataAudit is Ownable {
    struct AccessLog {
        address accessor;
        address patient;
        uint256 recordId;
        uint256 timestamp;
        string purpose;
        bytes signature;
    }
    
    AccessLog[] private _accessLogs;
    mapping(address => uint256[]) private _patientLogs;
    mapping(address => uint256[]) private _accessorLogs;
    
    event AccessLogged(
        address indexed accessor,
        address indexed patient,
        uint256 recordId,
        uint256 timestamp
    );

    function logAccess(
        address accessor,
        address patient,
        uint256 recordId,
        string memory purpose,
        bytes memory signature
    ) external onlyOwner {
        uint256 logId = _accessLogs.length;
        _accessLogs.push(AccessLog({
            accessor: accessor,
            patient: patient,
            recordId: recordId,
            timestamp: block.timestamp,
            purpose: purpose,
            signature: signature
        }));
        
        _patientLogs[patient].push(logId);
        _accessorLogs[accessor].push(logId);
        
        emit AccessLogged(accessor, patient, recordId, block.timestamp);
    }

    function getLogsByPatient(address patient) 
        external 
        view 
        returns (AccessLog[] memory) 
    {
        uint256[] memory logIds = _patientLogs[patient];
        AccessLog[] memory logs = new AccessLog[](logIds.length);
        
        for (uint i = 0; i < logIds.length; i++) {
            logs[i] = _accessLogs[logIds[i]];
        }
        
        return logs;
    }

    function getLogsByAccessor(address accessor) 
        external 
        view 
        returns (AccessLog[] memory) 
    {
        uint256[] memory logIds = _accessorLogs[accessor];
        AccessLog[] memory logs = new AccessLog[](logIds.length);
        
        for (uint i = 0; i < logIds.length; i++) {
            logs[i] = _accessLogs[logIds[i]];
        }
        
        return logs;
    }

    function getAllLogs() external view onlyOwner returns (AccessLog[] memory) {
        return _accessLogs;
    }

    function verifyLogSignature(uint256 logId) 
        external 
        view 
        returns (bool) 
    {
        require(logId < _accessLogs.length, "Invalid log ID");
        AccessLog memory log = _accessLogs[logId];
        
        bytes32 messageHash = keccak256(
            abi.encodePacked(
                log.accessor,
                log.patient,
                log.recordId,
                log.timestamp,
                log.purpose
            )
        );
        
        address signer = messageHash.recover(log.signature);
        return signer == log.accessor;
    }
}