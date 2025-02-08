// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./IUSDC.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/IERC20Permit.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import {IRouterClient} from "@chainlink/contracts-ccip/src/v0.8/ccip/interfaces/IRouterClient.sol";
import {Client} from "@chainlink/contracts-ccip/src/v0.8/ccip/libraries/Client.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract CirclePay is Ownable {
    using ECDSA for bytes32;

    IRouterClient private s_router;
    IUSDC public usdcToken;

    error NotEnoughBalance(uint256 currentBalance, uint256 calculatedFees);
    error NothingToWithdraw(); // Used when trying to withdraw Ether but there's nothing to withdraw.
    error FailedToWithdrawEth(address owner, address target, uint256 value); // Used when the withdrawal of Ether fails.
    event FeeCharged(bytes32 campaignId, uint256 feeAmount);

    mapping(uint256 => uint64) public chainIdTochainSelectorMapping;

    // Optimism
    // chain selector: 5224473277236331295
    // chainId: 11155420

    // router address for CCIP
    constructor(
        address _router,
        address _usdcTokenAddress
    ) Ownable(msg.sender) {
        s_router = IRouterClient(_router); // 0xD3b06cEbF099CE7DA4AcCf578aaebFDBd6e88a93 base
        usdcToken = IUSDC(_usdcTokenAddress); // 0x036CbD53842c5426634e7929541eC2318f3dCF7e base
    }

    struct Campaign {
        string videoId;
        address owner;
        uint256 reserve;
    }

    mapping(bytes32 => Campaign) public campaigns;
    mapping(address => bytes32[]) private ownerCampaigns;

    event CampaignRegistered(bytes32 campaignId, address owner);
    event CampaignFunded(bytes32 campaignId, address funder, uint256 amount);

    function execute(
        address from,
        uint256 value,
        uint256 validAfter,
        uint256 validBefore,
        bytes32 nonce,
        bytes memory signature,
        uint256 targetChainId,
        address receiver,
        bytes32 _campaignId,
        uint256 _feeAmount
    ) public {
        if (block.chainid == targetChainId) {
            usdcToken.transferWithAuthorization(
                from,
                receiver,
                value,
                validAfter,
                validBefore,
                nonce,
                signature
            );
        } else {
            transferUsdcCrossChain(
                from,
                value,
                validAfter,
                validBefore,
                nonce,
                signature,
                targetChainId,
                receiver
            );
        }
        chargeFee(_campaignId, _feeAmount);
    }

    /**
     * @dev Registers a new campaign for the sender.
     */
    function registerCampaign(string calldata _videoId) public payable {
        bytes32 campaignId = keccak256(
            abi.encodePacked(msg.sender, block.timestamp)
        );
        require(
            campaigns[campaignId].owner == address(0),
            "Campaign already exists"
        );

        campaigns[campaignId] = Campaign({
            videoId: _videoId,
            owner: msg.sender,
            reserve: msg.value
        });

        ownerCampaigns[msg.sender].push(campaignId);

        emit CampaignRegistered(campaignId, msg.sender);
    }

    /**
     * @dev Allows users to fund an existing campaign.
     * @param _campaignId The ID of the campaign to fund.
     */
    function fundCampaign(bytes32 _campaignId) public payable {
        Campaign storage campaign = campaigns[_campaignId];
        require(campaign.owner != address(0), "Campaign does not exist");

        campaign.reserve += msg.value;

        emit CampaignFunded(_campaignId, msg.sender, msg.value);
    }

    function changeVideoId(
        bytes32 _campaignId,
        string calldata _newVideoId
    ) public {
        Campaign storage campaign = campaigns[_campaignId];
        require(campaign.owner != address(0), "Campaign does not exist");

        campaign.videoId = _newVideoId;
    }

    /**
     * @dev Charges a specified fee from the campaign reserve.
     * @param _campaignId The ID of the campaign.
     * @param _feeAmount The fee amount to charge.
     */
    function chargeFee(bytes32 _campaignId, uint256 _feeAmount) public {
        Campaign storage campaign = campaigns[_campaignId];
        require(campaign.owner != address(0), "Campaign does not exist");
        require(
            campaign.reserve >= _feeAmount,
            "Insufficient reserve to charge fee"
        );

        campaign.reserve -= _feeAmount;

        emit FeeCharged(_campaignId, _feeAmount);
    }

    /**
     * @dev Gets all campaign IDs owned by a specific address.
     * @param _owner The address of the campaign owner.
     * @return An array of campaign IDs.
     */
    function getCampaignsByOwner(
        address _owner
    ) public view returns (bytes32[] memory) {
        return ownerCampaigns[_owner];
    }

    /**
     * @dev Gets the details of a specific campaign by ID.
     * @param _campaignId The ID of the campaign.
     * @return The campaign details.
     */
    function getCampaign(
        bytes32 _campaignId
    ) public view returns (Campaign memory) {
        Campaign memory campaign = campaigns[_campaignId];
        require(campaign.owner != address(0), "Campaign does not exist");
        return campaign;
    }

    function setChainSelector(
        uint64 _chainSelector,
        uint256 _chainId
    ) public onlyOwner {
        chainIdTochainSelectorMapping[_chainId] = _chainSelector;
    }

    // Function to transfer USDC tokens to the contract using authorization
    function transferUsdcCrossChain(
        address from,
        uint256 value,
        uint256 validAfter,
        uint256 validBefore,
        bytes32 nonce,
        bytes memory signature,
        uint256 targetChainId,
        address receiver
    ) public {
        // take funds to contract // eip3009
        usdcToken.transferWithAuthorization(
            from,
            address(this),
            value,
            validAfter,
            validBefore,
            nonce,
            signature
        );
        // send crosschain to intended user
        transferTokensPayNative(
            chainIdTochainSelectorMapping[targetChainId],
            receiver,
            address(usdcToken),
            value
        );
    }

    ///////////////////////////////////////////////--CCIP--////////////////////////////////////////////////////////

    //CCIP Implementation to send Tokens Cross chain
    function transferTokensPayNative(
        uint64 _destinationChainSelector,
        address _receiver,
        address _token,
        uint256 _amount
    ) internal returns (bytes32 messageId) {
        // Create an EVM2AnyMessage struct in memory with necessary information for sending a cross-chain message
        // address(0) means fees are paid in native gas
        Client.EVM2AnyMessage memory evm2AnyMessage = _buildCCIPMessage(
            _receiver,
            _token,
            _amount,
            address(0)
        );

        // Get the fee required to send the message
        uint256 fees = s_router.getFee(
            _destinationChainSelector,
            evm2AnyMessage
        );

        if (fees > address(this).balance)
            revert NotEnoughBalance(address(this).balance, fees);

        // approve the Router to spend tokens on contract's behalf. It will spend the amount of the given token
        IERC20(_token).approve(address(s_router), _amount);

        // Send the message through the router and store the returned message ID
        messageId = s_router.ccipSend{value: fees}(
            _destinationChainSelector,
            evm2AnyMessage
        );

        // Return the message ID
        return messageId;
    }

    function getEstimatedFees(
        uint64 __destinationChainSelector,
        address _receiver,
        address _token,
        uint256 _amount
    ) public view returns (uint256) {
        // Create an EVM2AnyMessage struct in memory with necessary information for sending a cross-chain message
        // address(0) means fees are paid in native gas
        Client.EVM2AnyMessage memory evm2AnyMessage = _buildCCIPMessage(
            _receiver,
            _token,
            _amount,
            address(0)
        );
        IRouterClient router = IRouterClient(address(s_router));
        return router.getFee(__destinationChainSelector, evm2AnyMessage);
    }

    function _buildCCIPMessage(
        address _receiver,
        address _token,
        uint256 _amount,
        address _feeTokenAddress
    ) private pure returns (Client.EVM2AnyMessage memory) {
        // Set the token amounts
        Client.EVMTokenAmount[]
            memory tokenAmounts = new Client.EVMTokenAmount[](1);
        tokenAmounts[0] = Client.EVMTokenAmount({
            token: _token,
            amount: _amount
        });

        // Create an EVM2AnyMessage struct in memory with necessary information for sending a cross-chain message
        return
            Client.EVM2AnyMessage({
                receiver: abi.encode(_receiver), // ABI-encoded receiver address
                data: "", // No data
                tokenAmounts: tokenAmounts, // The amount and type of token being transferred
                extraArgs: Client._argsToBytes(
                    // Additional arguments, setting gas limit to 0 as we are not sending any data
                    Client.EVMExtraArgsV1({gasLimit: 0})
                ),
                // Set the feeToken to a feeTokenAddress, indicating specific asset will be used for fees
                feeToken: _feeTokenAddress
            });
    }

    ///////////////////////////////////////////////--onlyOwner--///////////////////////////////////////////////////

    /// @notice Allows the contract owner to withdraw the entire balance of Ether from the contract.
    /// @dev This function reverts if there are no funds to withdraw or if the transfer fails.
    /// It should only be callable by the owner of the contract.
    /// @param _beneficiary The address to which the Ether should be transferred.
    function withdraw(address _beneficiary) public onlyOwner {
        // Retrieve the balance of this contract
        uint256 amount = address(this).balance;

        // Revert if there is nothing to withdraw
        if (amount == 0) revert NothingToWithdraw();

        // Attempt to send the funds, capturing the success status and discarding any return data
        (bool sent, ) = _beneficiary.call{value: amount}("");

        // Revert if the send failed, with information about the attempted transfer
        if (!sent) revert FailedToWithdrawEth(msg.sender, _beneficiary, amount);
    }

    /// @notice Allows the owner of the contract to withdraw all tokens of a specific ERC20 token.
    /// @dev This function reverts with a 'NothingToWithdraw' error if there are no tokens to withdraw.
    /// @param _beneficiary The address to which the tokens will be sent.
    /// @param _token The contract address of the ERC20 token to be withdrawn.
    function withdrawToken(
        address _beneficiary,
        address _token
    ) public onlyOwner {
        // Retrieve the balance of this contract
        uint256 amount = IERC20(_token).balanceOf(address(this));

        // Revert if there is nothing to withdraw
        if (amount == 0) revert NothingToWithdraw();

        IERC20(_token).transfer(_beneficiary, amount);
    }

    receive() external payable {}
}
