import { useState } from "react";
import * as CCIP from "@chainlink/ccip-js";
import { createWalletClient, createPublicClient, custom, http } from "viem";
import { sepolia } from "viem/chains";

export default function CreatePage() {
  const [walletAddress, setWalletAddress] = useState("");
  const [approvalStatus, setApprovalStatus] = useState("");
  const [fee, setFee] = useState<string | null>(null);
  const [transferStatus, setTransferStatus] = useState("");
  const [messageStatus, setMessageStatus] = useState("");

  // Initialize wallet and public clients
  const walletClient = createWalletClient({
    chain: sepolia,
    transport: custom(window.ethereum),
  });

  const publicClient = createPublicClient({
    chain: sepolia,
    transport: http(),
  });

  // Create CCIP Client
  const ccipClient = CCIP.createClient();

  // Connect Wallet
  const connectWallet = async () => {
    try {
      const accounts = await walletClient.request({
        method: 'eth_requestAccounts',
      });
      setWalletAddress(accounts[0]);
    } catch (error: any) {
      setWalletAddress(`Error: ${error.message}`);
    }
  };

  // Approve tokens
  const handleApprove = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const tokenAddress = (form.tokenAddress as HTMLInputElement).value;
    const routerAddress = (form.routerAddress as HTMLInputElement).value;
    const amount = (form.amount as HTMLInputElement).value;

    try {
      const { txHash } = await ccipClient.approveRouter({
        client: walletClient,
        routerAddress,
        tokenAddress,
        amount: BigInt(amount),
        waitForReceipt: true,
      });
      setApprovalStatus(`Approval Successful! Tx Hash: ${txHash}`);
    } catch (error: any) {
      setApprovalStatus(`Error approving token: ${error.message}`);
    }
  };

  // Calculate Fee
  const handleCalculateFee = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const routerAddress = (form.routerAddress as HTMLInputElement).value;
    const tokenAddress = (form.tokenAddress as HTMLInputElement).value;
    const amount = (form.amount as HTMLInputElement).value;
    const destinationChainSelector = (form.destinationChainSelector as HTMLInputElement).value;
    const destinationAccount = (form.destinationAccount as HTMLInputElement).value;

    try {
      const calculatedFee = await ccipClient.getFee({
        client: publicClient,
        routerAddress,
        tokenAddress,
        amount: BigInt(amount),
        destinationChainSelector,
        destinationAccount,
      });
      setFee(calculatedFee.toLocaleString());
    } catch (error: any) {
      setFee(`Error calculating fee: ${error.message}`);
    }
  };

  // Send Transfer
  const handleTransfer = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const routerAddress = (form.routerAddress as HTMLInputElement).value;
    const tokenAddress = (form.tokenAddress as HTMLInputElement).value;
    const amount = (form.amount as HTMLInputElement).value;
    const destinationChainSelector = (form.destinationChainSelector as HTMLInputElement).value;
    const destinationAccount = (form.destinationAccount as HTMLInputElement).value;

    try {
      const { txHash, messageId } = await ccipClient.transferTokens({
        client: walletClient,
        routerAddress,
        tokenAddress,
        amount: BigInt(amount),
        destinationChainSelector,
        destinationAccount,
      });
      setTransferStatus(`Transfer successful! Tx Hash: ${txHash}, Message ID: ${messageId}`);
    } catch (error: any) {
      setTransferStatus(`Error transferring tokens: ${error.message}`);
    }
  };

  // Send Message
  const handleSendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const messageContent = (form.messageContent as HTMLInputElement).value;
    const destinationAddress = (form.destinationAddress as HTMLInputElement).value;

    try {
      const { messageId } = await ccipClient.sendMessage({
        client: walletClient,
        destinationAddress,
        messageContent,
      });
      setMessageStatus(`Message Sent! Message ID: ${messageId}`);
    } catch (error: any) {
      setMessageStatus(`Error sending message: ${error.message}`);
    }
  };

  return (
    <div style={containerStyle}>
      {/* Wallet Connect Section */}
      <div style={sectionStyle}>
        <h2>Connect Wallet</h2>
        <div>
          <button onClick={connectWallet} style={buttonStyle}>Injected</button>
          <button onClick={connectWallet} style={buttonStyle}>MetaMask</button>
          <button onClick={connectWallet} style={buttonStyle}>Coinbase Wallet</button>
        </div>
        <p>Address: {walletAddress}</p>
      </div>

      {/* Approve Tokens */}
      <div style={sectionStyle}>
        <h2>Get Allowance:</h2>
        <form onSubmit={handleApprove} style={formStyle}>
          <input type="text" name="routerAddress" placeholder="Router Address*" required style={inputStyle} />
          <input type="text" name="tokenAddress" placeholder="Token Address*" required style={inputStyle} />
          <input type="number" name="amount" placeholder="Amount*" required style={inputStyle} />
          <button type="submit" style={buttonStyle}>Approve</button>
        </form>
        {approvalStatus && <p>{approvalStatus}</p>}
      </div>

      {/* Get On-ramp */}
      <div style={sectionStyle}>
        <h2>Get On-ramp Address:</h2>
        <form onSubmit={handleCalculateFee} style={formStyle}>
          <input type="text" name="routerAddress" placeholder="Router Address*" required style={inputStyle} />
          <input type="text" name="destinationChainSelector" placeholder="Destination Chain Selector*" required style={inputStyle} />
          <button type="submit" style={buttonStyle}>Get On-ramp</button>
        </form>
        {fee && <p>Estimated Fee: {fee}</p>}
      </div>

      {/* Send Cross-Chain Transfer */}
      <div style={sectionStyle}>
        <h2>Send Cross-Chain Transfer:</h2>
        <form onSubmit={handleTransfer} style={formStyle}>
          <input type="text" name="routerAddress" placeholder="Router Address*" required style={inputStyle} />
          <input type="text" name="tokenAddress" placeholder="Token Address*" required style={inputStyle} />
          <input type="number" name="amount" placeholder="Amount*" required style={inputStyle} />
          <input type="text" name="destinationChainSelector" placeholder="Destination Chain Selector*" required style={inputStyle} />
          <input type="text" name="destinationAccount" placeholder="Destination Account*" required style={inputStyle} />
          <button type="submit" style={buttonStyle}>Send Tokens</button>
        </form>
        {transferStatus && <p>{transferStatus}</p>}
      </div>

      {/* Send Message */}
      <div style={sectionStyle}>
        <h2>Send Message:</h2>
        <form onSubmit={handleSendMessage} style={formStyle}>
          <input type="text" name="destinationAddress" placeholder="Destination Address*" required style={inputStyle} />
          <input type="text" name="messageContent" placeholder="Message Content*" required style={inputStyle} />
          <button type="submit" style={buttonStyle}>Send Message</button>
        </form>
        {messageStatus && <p>{messageStatus}</p>}
      </div>
    </div>
  );
}

const containerStyle = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "20px",
  padding: "20px",
  backgroundColor: "#121212",
  color: "#fff",
};

const sectionStyle = {
  border: "1px solid #333",
  padding: "20px",
  backgroundColor: "#1e1e1e",
  borderRadius: "10px",
};

const inputStyle = {
  padding: "12px",
  border: "1px solid #444",
  borderRadius: "8px",
  backgroundColor: "#333",
  color: "#fff",
  marginBottom: "12px",
  width: "100%",
};

const buttonStyle = {
  padding: "14px",
  backgroundColor: "#2D9CDB",
  color: "#fff",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  width: "100%",
  fontSize: "16px",
};

const formStyle = {
  display: "flex",
  flexDirection: "column",
};
