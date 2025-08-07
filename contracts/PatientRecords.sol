// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

contract PatientRecords is Ownable {
    using Counters for Counters.Counter;
    using ECDSA for bytes32;

    struct MedicalRecord {
        string ipfsCID;
        string recordType;
        uint256 timestamp;
        address uploadedBy;
        bool isEncrypted;
        string encryptionScheme;
    }
    
    struct AccessPermission {
        address grantee;
        uint256 recordId;
        uint256 expiry;
        bool isActive;
        string purpose;
    }
    
    struct PatientProfile {
        string name;
        string dob;
        string bloodType;
        string allergies;
        string conditions;
    }

    struct AccessRequest {
        address requester;
        uint256 recordId;
        uint256 timestamp;
        bool resolved;
        bool approved;
        string purpose;
    }

    Counters.Counter private _recordCounter;
    Counters.Counter private _requestCounter;
    
    mapping(address => MedicalRecord[]) private _patientRecords;
    mapping(address => AccessPermission[]) private _accessPermissions;
    mapping(address => AccessRequest[]) private _accessRequests;
    mapping(address => PatientProfile) private _patientProfiles;
    mapping(address => bool) private _registeredHospitals;
    mapping(address => uint256) private _nonces;
    
    event RecordAdded(address indexed patient, uint256 recordId, string ipfsCID);
    event AccessGranted(address indexed patient, address grantee, uint256 recordId, string purpose);
    event AccessRevoked(address indexed patient, address grantee, uint256 recordId);
    event AccessRequested(address indexed patient, address requester, uint256 recordId, string purpose);
    event AccessApproved(address indexed patient, address requester, uint256 recordId);
    event AccessDenied(address indexed patient, address requester, uint256 recordId);
    event RecordAccessed(address indexed patient, address accessor, uint256 recordId, uint256 timestamp);
    event ProfileUpdated(address indexed patient);

    modifier onlyRegisteredHospital() {
        require(_registeredHospitals[msg.sender], "Caller is not a registered hospital");
        _;
    }

    function addRecord(
        string memory ipfsCID,
        string memory recordType,
        bool isEncrypted,
        string memory encryptionScheme
    ) external {
        uint256 recordId = _recordCounter.current();
        _patientRecords[msg.sender].push(MedicalRecord({
            ipfsCID: ipfsCID,
            recordType: recordType,
            timestamp: block.timestamp,
            uploadedBy: msg.sender,
            isEncrypted: isEncrypted,
            encryptionScheme: encryptionScheme
        }));
        
        _recordCounter.increment();
        emit RecordAdded(msg.sender, recordId, ipfsCID);
    }

    function grantAccess(
        address grantee,
        uint256 recordId,
        uint256 duration,
        string memory purpose
    ) external {
        require(recordId < _patientRecords[msg.sender].length, "Invalid record ID");
        require(_registeredHospitals[grantee], "Grantee must be registered");
        
        _accessPermissions[msg.sender].push(AccessPermission({
            grantee: grantee,
            recordId: recordId,
            expiry: block.timestamp + duration,
            isActive: true,
            purpose: purpose
        }));
        
        emit AccessGranted(msg.sender, grantee, recordId, purpose);
    }

    function requestAccess(
        address patient,
        uint256 recordId,
        string memory purpose
    ) external onlyRegisteredHospital {
        uint256 requestId = _requestCounter.current();
        _accessRequests[patient].push(AccessRequest({
            requester: msg.sender,
            recordId: recordId,
            timestamp: block.timestamp,
            resolved: false,
            approved: false,
            purpose: purpose
        }));
        
        _requestCounter.increment();
        emit AccessRequested(patient, msg.sender, recordId, purpose);
    }

    function approveAccess(uint256 requestId) external {
        require(requestId < _accessRequests[msg.sender].length, "Invalid request ID");
        AccessRequest storage request = _accessRequests[msg.sender][requestId];
        require(!request.resolved, "Request already resolved");
        
        request.resolved = true;
        request.approved = true;
        
        _accessPermissions[msg.sender].push(AccessPermission({
            grantee: request.requester,
            recordId: request.recordId,
            expiry: block.timestamp + 30 days,
            isActive: true,
            purpose: request.purpose
        }));
        
        emit AccessApproved(msg.sender, request.requester, request.recordId);
    }

    function denyAccess(uint256 requestId) external {
        require(requestId < _accessRequests[msg.sender].length, "Invalid request ID");
        AccessRequest storage request = _accessRequests[msg.sender][requestId];
        require(!request.resolved, "Request already resolved");
        
        request.resolved = true;
        emit AccessDenied(msg.sender, request.requester, request.recordId);
    }

    function revokeAccess(uint256 permissionId) external {
        require(permissionId < _accessPermissions[msg.sender].length, "Invalid permission ID");
        _accessPermissions[msg.sender][permissionId].isActive = false;
        
        emit AccessRevoked(
            msg.sender,
            _accessPermissions[msg.sender][permissionId].grantee,
            _accessPermissions[msg.sender][permissionId].recordId
        );
    }

    function updateProfile(
        string memory name,
        string memory dob,
        string memory bloodType,
        string memory allergies,
        string memory conditions
    ) external {
        _patientProfiles[msg.sender] = PatientProfile({
            name: name,
            dob: dob,
            bloodType: bloodType,
            allergies: allergies,
            conditions: conditions
        });
        
        emit ProfileUpdated(msg.sender);
    }

    function getRecord(address patient, uint256 recordId) 
        external 
        returns (MedicalRecord memory) 
    {
        require(_hasAccess(patient, msg.sender, recordId), "Access denied");
        
        emit RecordAccessed(patient, msg.sender, recordId, block.timestamp);
        return _patientRecords[patient][recordId];
    }

    function _hasAccess(
        address patient,
        address requester,
        uint256 recordId
    ) private view returns (bool) {
        if (patient == requester) return true;
        
        for (uint i = 0; i < _accessPermissions[patient].length; i++) {
            AccessPermission memory permission = _accessPermissions[patient][i];
            if (permission.grantee == requester && 
                permission.recordId == recordId && 
                permission.isActive && 
                permission.expiry > block.timestamp) {
                return true;
            }
        }
        return false;
    }

    // Admin functions
    function registerHospital(address hospital) external onlyOwner {
        _registeredHospitals[hospital] = true;
    }

    function getPatientProfile(address patient) external view returns (PatientProfile memory) {
        return _patientProfiles[patient];
    }

    function getRecords(address patient) external view returns (MedicalRecord[] memory) {
        return _patientRecords[patient];
    }

    function getAccessPermissions(address patient) external view returns (AccessPermission[] memory) {
        return _accessPermissions[patient];
    }

    function getAccessRequests(address patient) external view returns (AccessRequest[] memory) {
        return _accessRequests[patient];
    }

    function isHospitalRegistered(address hospital) external view returns (bool) {
        return _registeredHospitals[hospital];
    }

    function getNonce(address user) external view returns (uint256) {
        return _nonces[user];
    }

    function verifySignature(
        address signer,
        bytes32 hash,
        bytes memory signature
    ) external view returns (bool) {
        return hash.recover(signature) == signer;
    }
}