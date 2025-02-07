// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract Bucket is ReentrancyGuard {
    using Counters for Counters.Counter;

    address public creator;
    bool public isPublic;
    mapping(address => uint256) public tokenProportions;
    mapping(address => uint256) public tokenBalances;
    string public name;
    string public description;
    string[] public chains;

    struct BucketStruct {
        address tokenAddress;
        uint256 share;
        string chain;
    }

    BucketStruct[] public bucketsDetails;

    event BucketCreated(
        address indexed creator,
        bool isPublic,
        address[] tokens,
        uint256[] proportions,
        string[] chains,
        string name,
        string description
    );
    event TokensLocked(address indexed token, uint256 amount);

    modifier onlyCreator() {
        require(msg.sender == creator, "Not the bucket creator");
        _;
    }

    constructor(
        address _creator,
        bool _isPublic,
        address[] memory _tokens,
        uint256[] memory _proportions,
        string[] memory _chains,
        string memory _name,
        string memory _description
    ) {
        require(
            _tokens.length == _proportions.length && _chains.length > 0,
            "Invalid input"
        );

        creator = _creator;
        isPublic = _isPublic;
        name = _name;
        description = _description;
        chains = _chains;

        uint256 totalProportion;
        for (uint256 i = 0; i < _tokens.length; i++) {
            require(_proportions[i] > 0, "Proportion must be greater than 0");
            totalProportion += _proportions[i];
            tokenProportions[_tokens[i]] = _proportions[i];
            bucketsDetails.push(
                BucketStruct({
                    tokenAddress: _tokens[i],
                    share: _proportions[i],
                    chain: _chains[i]
                })
            );
        }
        require(totalProportion == 100, "Total proportion must be 100");
    }

    function addToken(
        address token,
        uint256 amount
    ) external payable onlyCreator nonReentrant {
        require(amount > 0, "Amount must be greater than 0");
        require(msg.value == 0, "Ether value sent with the transaction should be 0");

        IERC20(token).transferFrom(msg.sender, address(this), amount);
        tokenBalances[token] += amount;
    }

    function withdrawTokens(address token) external onlyCreator nonReentrant {
        require(tokenBalances[token] > 0, "No tokens to withdraw");

        IERC20(token).approve(creator, tokenBalances[token]);
        IERC20(token).transfer(creator, tokenBalances[token]);
        tokenBalances[token] = 0;
    }

    function getBucketDetails(
        address bucketAddress
    )
        external
        view
        returns (
            address _creator,
            bool _isPublic,
            address[] memory _tokens,
            uint256[] memory _proportions,
            string[] memory _chains,
            string memory _name,
            string memory _description
        )
    {
        Bucket bucket = Bucket(bucketAddress);
        _creator = bucket.creator();
        _isPublic = bucket.isPublic();
        _name = bucket.name();
        _description = bucket.description();

        _tokens = new address[](bucketsDetails.length);
        _proportions = new uint256[](bucketsDetails.length);
        _chains = new string[](bucketsDetails.length);

        for (uint256 i = 0; i < bucketsDetails.length; i++) {
            _tokens[i] = bucketsDetails[i].tokenAddress;
            _proportions[i] = bucketsDetails[i].share;
            _chains[i] = bucketsDetails[i].chain;
        }
    }
}
