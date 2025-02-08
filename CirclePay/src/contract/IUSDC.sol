// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

interface IUSDC {
    function _chainId() external view returns (uint256);

    function _domainSeparator() external view returns (bytes32);

    function permit(
        address owner,
        address spender,
        uint256 value,
        uint256 deadline,
        bytes memory signature
    ) external;

    function transferWithAuthorization(
        address from,
        address to,
        uint256 value,
        uint256 validAfter,
        uint256 validBefore,
        bytes32 nonce,
        bytes memory signature
    ) external;

    function receiveWithAuthorization(
        address from,
        address to,
        uint256 value,
        uint256 validAfter,
        uint256 validBefore,
        bytes32 nonce,
        bytes memory signature
    ) external;

    function cancelAuthorization(
        address authorizer,
        bytes32 nonce,
        bytes memory signature
    ) external;

    function approve(address spender, uint256 value) external returns (bool);

    function increaseAllowance(
        address spender,
        uint256 increment
    ) external returns (bool);

    function decreaseAllowance(
        address spender,
        uint256 decrement
    ) external returns (bool);
}
