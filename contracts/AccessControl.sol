// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/access/AccessControl.sol";

contract AfyaAccessControl is AccessControl {
    bytes32 public constant DOCTOR_ROLE = keccak256("DOCTOR_ROLE");
    bytes32 public constant HOSPITAL_ROLE = keccak256("HOSPITAL_ROLE");
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");

    constructor() {
        _setupRole(ADMIN_ROLE, msg.sender);
        _setRoleAdmin(DOCTOR_ROLE, ADMIN_ROLE);
        _setRoleAdmin(HOSPITAL_ROLE, ADMIN_ROLE);
    }

    function grantDoctorRole(address account) external onlyRole(ADMIN_ROLE) {
        grantRole(DOCTOR_ROLE, account);
    }

    function grantHospitalRole(address account) external onlyRole(ADMIN_ROLE) {
        grantRole(HOSPITAL_ROLE, account);
    }

    function revokeDoctorRole(address account) external onlyRole(ADMIN_ROLE) {
        revokeRole(DOCTOR_ROLE, account);
    }

    function revokeHospitalRole(address account) external onlyRole(ADMIN_ROLE) {
        revokeRole(HOSPITAL_ROLE, account);
    }
}