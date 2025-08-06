// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/access/Ownable.sol";

contract PatientRecords is Ownable {
    constructor() Ownable() {}

    struct MedicalRecord {
        string ipfsCID;
        string recordType;
        uint256 timestamp;
        address uploadedBy;
        bool isEncrypted;
    }
    
    struct AccessPermission {
        address grantee;
        uint256 recordId;
        uint256 expiry;
        bool isActive;
    }
    
    mapping(address => MedicalRecord[]) private patientRecords;
    mapping(address => AccessPermission[]) private accessPermissions;
    mapping(address => bool) public registeredHospitals;
    
    event RecordAdded(address indexed patient, string ipfsCID);
    event AccessGranted(address indexed patient, address grantee, uint256 recordId);
    event AccessRevoked(address indexed patient, address grantee, uint256 recordId);
    
    modifier onlyHospital() {
        require(registeredHospitals[msg.sender], "Caller is not a registered hospital");
        _;
    }
    
    function addRecord(
        string memory _ipfsCID, 
        string memory _recordType, 
        bool _isEncrypted
    ) external {
        patientRecords[msg.sender].push(MedicalRecord({
            ipfsCID: _ipfsCID,
            recordType: _recordType,
            timestamp: block.timestamp,
            uploadedBy: msg.sender,
            isEncrypted: _isEncrypted
        }));
        
        emit RecordAdded(msg.sender, _ipfsCID);
    }
    
    function grantAccess(
        address _grantee,
        uint256 _recordId,
        uint256 _duration
    ) external {
        require(_recordId < patientRecords[msg.sender].length, "Invalid record ID");
        require(registeredHospitals[_grantee], "Grantee must be a registered hospital");
        
        accessPermissions[msg.sender].push(AccessPermission({
            grantee: _grantee,
            recordId: _recordId,
            expiry: block.timestamp + _duration,
            isActive: true
        }));
        
        emit AccessGranted(msg.sender, _grantee, _recordId);
    }
    
    function revokeAccess(uint256 _permissionId) external {
        require(_permissionId < accessPermissions[msg.sender].length, "Invalid permission ID");
        accessPermissions[msg.sender][_permissionId].isActive = false;
        
        emit AccessRevoked(
            msg.sender,
            accessPermissions[msg.sender][_permissionId].grantee,
            accessPermissions[msg.sender][_permissionId].recordId
        );
    }
    
    function getRecord(address _patient, uint256 _recordId) 
        external 
        view 
        returns (MedicalRecord memory) 
    {
        require(_hasAccess(_patient, msg.sender, _recordId), "Access denied");
        return patientRecords[_patient][_recordId];
    }
    
    function _hasAccess(
        address _patient,
        address _requester,
        uint256 _recordId
    ) private view returns (bool) {
        if (_patient == _requester) return true;
        
        for (uint i = 0; i < accessPermissions[_patient].length; i++) {
            AccessPermission memory permission = accessPermissions[_patient][i];
            if (permission.grantee == _requester && 
                permission.recordId == _recordId && 
                permission.isActive && 
                permission.expiry > block.timestamp) {
                return true;
            }
        }
        return false;
    }
    
    // Admin functions
    function registerHospital(address _hospital) external onlyOwner {
        registeredHospitals[_hospital] = true;
    }
}