import React from "react";

// We'll use ethers to interact with the Ethereum network and our contract
import { ethers } from "ethers";

// We import the contract's artifacts and address here, as we are going to be
// using them with ethers
import TokenArtifact from "../contracts/LoseMoneyNFT.json";
import contractAddress from "../contracts/contract-address.json";

// All the logic of this dapp is contained in the Dapp component.
// These other components are just presentational ones: they don't have any
// logic. They just render HTML.
import { NoWalletDetected } from "./NoWalletDetected";
import { ConnectWallet } from "./ConnectWallet";
import { Loading } from "./Loading";
import { Marketplace } from "./Marketplace";
import { TransactionErrorMessage } from "./TransactionErrorMessage";
import { WaitingForTransactionMessage } from "./WaitingForTransactionMessage";
import { IntroPage } from "./IntroPage";
// import { NoTokensMessage } from "./NoTokensMessage";

import Logo from './xspend_logo.png';


// const path = require('path')


// This is the Hardhat Network id, you might change it in the hardhat.config.js.
// If you are using MetaMask, be sure to change the Network id to 1337.
// Here's a list of network ids https://docs.metamask.io/guide/ethereum-provider.html#properties
// to use when deploying to other networks.
const HARDHAT_NETWORK_ID = '31337';

// This is an error code that indicates that the user canceled a transaction
const ERROR_CODE_TX_REJECTED_BY_USER = 4001;

// const productPrices = {
//   1: "0",
//   2: "0.001",
//   3: "0.002",
//   4: "0.003",
//   5: "0.004",
//   6: "0.005",
//   7: "0.006",
//   8: "0.007",
//   9: "0.008",
//   10: "0.009",
//   11: "0.01",
//   12: "0.011",
// }

// // ipfs.add parameters for more deterministic CIDs
// const ipfsAddOptions = {
//   cidVersion: 1,
//   hashAlg: 'sha2-256'
// }

// This component is in charge of doing these things:
//   1. It connects to the user's wallet
//   2. Initializes ethers and the Token contract
//   3. Polls the user balance to keep it updated.
//   4. Transfers tokens by sending transactions
//   5. Renders the whole application
//
// Note that (3) and (4) are specific of this sample application, but they show
// you how to keep your Dapp and contract's state in sync,  and how to send a
// transaction.
export class Dapp extends React.Component {
  constructor(props) {
    super(props);
  
    // We store multiple things in Dapp's state.
    // You don't need to follow this pattern, but it's an useful example.
    this.initialState = {
      // The info of the token (i.e. It's Name and symbol)
      tokenData: undefined,
      // The user's address and balance
      selectedAddress: undefined,
      balance: undefined,
      // The ID about transactions being sent, and any possible error with them
      txBeingSent: undefined,
      transactionError: undefined,
      networkError: undefined,
    };

    this.state = this.initialState;
  }

  render() {


    // Ethereum wallets inject the window.ethereum object. If it hasn't been
    // injected, we instruct the user to install MetaMask.
    if (window.ethereum === undefined) {
      return (
        <div>
          <IntroPage />
          <NoWalletDetected />
        </div>
      );
    }

    // The next thing we need to do, is to ask the user to connect their wallet.
    // When the wallet gets connected, we are going to save the users's address
    // in the component's state. So, if it hasn't been saved yet, we have
    // to show the ConnectWallet component.
    //
    // Note that we pass it a callback that is going to be called when the user
    // clicks a button. This callback just calls the _connectWallet method.
    if (!this.state.selectedAddress) {
      return (
        <div>
        <IntroPage />
        <ConnectWallet 
          connectWallet={() => this._connectWallet()} 
          networkError={this.state.networkError}
          dismiss={() => this._dismissNetworkError()}
        />
        </div>
      );
    }

    // If the token data or the user's balance hasn't loaded yet, we show
    // a loading component.
    if (!this.state.tokenData || !this.state.balance) {
      return <Loading />;
    }

    // If everything is loaded, we render the application.
    return (
      <div className="container p-4">
        <div className="row">
          <div className="col-12">
              <center>
                <img src={Logo} alt="xSpend logo" width="200"/>
                <p><i>Spend seamlessly, xSpend the economy.</i></p>
              </center>
            <p>
              Welcome, <b>{this.state.selectedAddress}</b>!
            </p>
            <h3>
              <strong><i>xSpend Marketplace</i></strong>
            </h3>
            <p>
              Below you can find the products that we have in stock. To buy a product,
              simply press its button and make the payment with your wallet. The prices
              listed below unfortunately do not include the gas fees. Note that
              we currently do not have the means to give refunds.
            </p>
          </div>
        </div>

        <hr />

        <div className="row">
          <div className="col-12">
            {/* 
              Sending a transaction isn't an immediate action. You have to wait
              for it to be mined.
              If we are waiting for one, we show a message here.
            */}
            {this.state.txBeingSent && (
              <WaitingForTransactionMessage txHash={this.state.txBeingSent} />
            )}

            {/* 
              Sending a transaction can fail in multiple ways. 
              If that happened, we show a message here.
            */}
            {this.state.transactionError && (
              <TransactionErrorMessage
                message={this._getRpcErrorMessage(this.state.transactionError)}
                dismiss={() => this._dismissTransactionError()}
              />
            )}
          </div>
        </div>

        <div className="row">
          <div className="col-12">

            {/*
              This component displays a form that the user can use to send a 
              transaction and transfer some tokens.
              The component doesn't have logic, it just calls the transferTokens
              callback.
            */}
            {(
              <Marketplace
                createProduct={(productNum, options) =>
                  this.createProduct(productNum, options)
                }
                selectedAddress={this.state.selectedAddress}
              />
            )}
          </div>
        </div>
      </div>
    );
  }

  componentWillUnmount() {
    // We poll the user's balance, so we have to stop doing that when Dapp
    // gets unmounted
    this._stopPollingData();
  }

  async _connectWallet() {
    // This method is run when the user clicks the Connect. It connects the
    // dapp to the user's wallet, and initializes it.

    // To connect to the user's wallet, we have to run this method.
    // It returns a promise that will resolve to the user's address.
    const [selectedAddress] = await window.ethereum.request({ method: 'eth_requestAccounts' });

    // Once we have the address, we can initialize the application.

    // First we check the network
    if (!this._checkNetwork()) {
      return;
    }

    this._initialize(selectedAddress);

    // We reinitialize it whenever the user changes their account.
    window.ethereum.on("accountsChanged", ([newAddress]) => {
      this._stopPollingData();
      // `accountsChanged` event can be triggered with an undefined newAddress.
      // This happens when the user removes the Dapp from the "Connected
      // list of sites allowed access to your addresses" (Metamask > Settings > Connections)
      // To avoid errors, we reset the dapp state 
      if (newAddress === undefined) {
        return this._resetState();
      }
      
      this._initialize(newAddress);
    });
    
    // We reset the dapp state if the network is changed
    window.ethereum.on("chainChanged", ([networkId]) => {
      this._stopPollingData();
      this._resetState();
    });
  }

  _initialize(userAddress) {
    // This method initializes the dapp

    // We first store the user's address in the component's state
    this.setState({
      selectedAddress: userAddress,
    });

    // Then, we initialize ethers, fetch the token's data, and start polling
    // for the user's balance.

    // Fetching the token data and the user's balance are specific to this
    // sample project, but you can reuse the same initialization pattern.
    this._initializeEthers();
    this._getTokenData();
    this._startPollingData();
  }

  async _initializeEthers() {
    // We first initialize ethers by creating a provider using window.ethereum
    this._provider = new ethers.providers.Web3Provider(window.ethereum);

    // Then, we initialize the contract using that provider and the token's
    // artifact. You can do this same thing with your contracts.
    this._token = new ethers.Contract(
      contractAddress.Token,
      TokenArtifact.abi,
      this._provider.getSigner(0)
    );
  }

  // The next two methods are needed to start and stop polling data. While
  // the data being polled here is specific to this example, you can use this
  // pattern to read any data from your contracts.
  //
  // Note that if you don't need it to update in near real time, you probably
  // don't need to poll it. If that's the case, you can just fetch it when you
  // initialize the app, as we do with the token data.
  _startPollingData() {
    this._pollDataInterval = setInterval(() => this._updateBalance(), 1000);

    // We run it once immediately so we don't have to wait for it
    this._updateBalance();
  }

  _stopPollingData() {
    clearInterval(this._pollDataInterval);
    this._pollDataInterval = undefined;
  }

  // The next two methods just read from the contract and store the results
  // in the component state.
  async _getTokenData() {
    const name = await this._token.name();
    const symbol = await this._token.symbol();

    this.setState({ tokenData: { name, symbol } });
  }

  async _updateBalance() {
    const balance = await this._token.balanceOf(this.state.selectedAddress);
    this.setState({ balance });
  }

  // This method sends an ethereum transaction to transfer tokens.
  // While this action is specific to this application, it illustrates how to
  // send a transaction.
  async _mintItem(to, price, metadataURI) {
    // Sending a transaction is a complex operation:
    //   - The user can reject it
    //   - It can fail before reaching the ethereum network (i.e. if the user
    //     doesn't have ETH for paying for the tx's gas)
    //   - It has to be mined, so it isn't immediately confirmed.
    //     Note that some testing networks, like Hardhat Network, do mine
    //     transactions immediately, but your dapp should be prepared for
    //     other networks.
    //   - It can fail once mined.
    //
    // This method handles all of those things, so keep reading to learn how to
    // do it.

    try {
      // If a transaction fails, we save that error in the component's state.
      // We only save one such error, so before sending a second transaction, we
      // clear it.
      this._dismissTransactionError();

      // We send the transaction, and save its hash in the Dapp's state. This
      // way we can indicate that we are waiting for it to be mined.
      const tx = await this._token.mintItem(to, metadataURI, { value: ethers.utils.parseUnits(price, "ether") });
      this.setState({ txBeingSent: tx.hash });

      // We use .wait() to wait for the transaction to be mined. This method
      // returns the transaction's receipt.
      const receipt = await tx.wait();

      // The receipt, contains a status flag, which is 0 to indicate an error.
      if (receipt.status === 0) {
        // We can't know the exact error that made the transaction fail when it
        // was mined, so we throw this generic one.
        throw new Error("Transaction failed");
      }

      // If we got here, the transaction was successful, so you may want to
      // update your state. Here, we update the user's balance.
      await this._updateBalance();
    } catch (error) {
      // We check the error code to see if this error was produced because the
      // user rejected a tx. If that's the case, we do nothing.
      if (error.code === ERROR_CODE_TX_REJECTED_BY_USER) {
        return;
      }

      // Other errors are logged and stored in the Dapp's state. This is used to
      // show them to the user, and for debugging.
      console.error(error);
      this.setState({ transactionError: error });
    } finally {
      // If we leave the try/catch, we aren't sending a tx anymore, so we clear
      // this part of the state.
      this.setState({ txBeingSent: undefined });
    }
  }

  // This method just clears part of the state.
  _dismissTransactionError() {
    this.setState({ transactionError: undefined });
  }

  // This method just clears part of the state.
  _dismissNetworkError() {
    this.setState({ networkError: undefined });
  }

  // This is an utility method that turns an RPC error into a human readable
  // message.
  _getRpcErrorMessage(error) {
    if (error.data) {
      return error.data.message;
    }

    return error.message;
  }

  // This method resets the state
  _resetState() {
    this.setState(this.initialState);
  }

  // This method checks if Metamask selected network is Localhost:8545 
  _checkNetwork() {
    if (window.ethereum.networkVersion === HARDHAT_NETWORK_ID) {
      return true;
    }

    this.setState({ 
      networkError: 'Please connect Metamask to Localhost:8545'
    });

    return false;
  }

  //////////////////////////////////////////////
  // ------ NFT Creation
  //////////////////////////////////////////////

  /**
   * Create a new NFT from the given asset data.
   * 
   * @param {Buffer|Uint8Array} content - a Buffer or UInt8Array of data (e.g. for an image)
   * @param {object} options
   * @param {?string} path - optional file path to set when storing the data on IPFS
   * @param {?string} name - optional name to set in NFT metadata
   * @param {?string} description - optional description to store in NFT metadata
   * @param {?string} owner - optional ethereum address that should own the new NFT. 
   * If missing, the default signing address will be used.
   * 
   * @typedef {object} CreateNFTResult
   * @property {string} tokenId - the unique ID of the new token
   * @property {string} ownerAddress - the ethereum address of the new token's owner
   * @property {object} metadata - the JSON metadata stored in IPFS and referenced by the token's metadata URI
   * @property {string} metadataURI - an ipfs:// URI for the NFT metadata
   * @property {string} metadataGatewayURL - an HTTP gateway URL for the NFT metadata
   * @property {string} assetURI - an ipfs:// URI for the NFT asset
   * @property {string} assetGatewayURL - an HTTP gateway URL for the NFT asset
   * 
   * @returns {Promise<CreateNFTResult>}
   */
  async createProduct(price, options) {
    // // add the asset to IPFS
    // const filePath = options.path || 'asset.bin';
    // const basename =  path.basename(filePath);

    // // When you add an object to IPFS with a directory prefix in its path,
    // // IPFS will create a directory structure for you. This is nice, because
    // // it gives us URIs with descriptive filenames in them e.g.
    // // 'ipfs://QmaNZ2FCgvBPqnxtkbToVVbK2Nes6xk5K4Ns6BsmkPucAM/cat-pic.png' instead of
    // // 'ipfs://QmaNZ2FCgvBPqnxtkbToVVbK2Nes6xk5K4Ns6BsmkPucAM'
    // const content = this.getProductContent(productNum);
    // const ipfsPath = '/nft/' + basename;
    // const { cid: assetCid } = await this.ipfs.add({ path: ipfsPath, content }, ipfsAddOptions);

    // // make the NFT metadata JSON
    // const assetURI = this.ensureIpfsUriPrefix(assetCid) + '/' + basename;
    // const metadata = await this.makeNFTMetadata(assetURI, options);

    // // add the metadata to IPFS
    // const { cid: metadataCid } = await this.ipfs.add({ path: '/nft/metadata.json', content: JSON.stringify(metadata)}, ipfsAddOptions);
    // const metadataURI = this.ensureIpfsUriPrefix(metadataCid) + '/metadata.json';

    // // get the address of the token owner from options, or use the default signing address if no owner is given
    // let ownerAddress = options.owner;
    // if (!ownerAddress) {
    //     ownerAddress = await this.defaultOwnerAddress();
    // }

    // mint a new token referencing the metadata URI
    /*const tokenId = */await this._mintItem(options.owner, price, "metadataURI");

    // // format and return the results
    // return {
    //     tokenId,
    //     ownerAddress,
    //     metadata,
    //     assetURI,
    //     metadataURI,
    // };
  }

  getProductContent(productNum) {
    const nextProductNum = this._token.tokenIdCounter() + 1;
    return 'LoseMoney Inc.\n' +
           '---------------------\n' +
           'This is your product. Enjoy!\n' +
           'Product #' + productNum + '\n' +
           '(This is the ' + nextProductNum + '. product we sold!)\n'
  }

  /**
   * Helper to construct metadata JSON for 
   * @param {string} assetCid - IPFS URI for the NFT asset
   * @param {object} options
   * @param {?string} name - optional name to set in NFT metadata
   * @param {?string} description - optional description to store in NFT metadata
   * @returns {object} - NFT metadata object
   */
  async makeNFTMetadata(assetURI, options) {
    const {name, description} = options;
    assetURI = this.ensureIpfsUriPrefix(assetURI);
    return {
        name,
        description,
        image: assetURI
    };
  }

  //////////////////////////////////////////////
  // -------- URI helpers
  //////////////////////////////////////////////

  /**
   * @param {string} cidOrURI either a CID string, or a URI string of the form `ipfs://${cid}`
   * @returns the input string with the `ipfs://` prefix stripped off
   */
  stripIpfsUriPrefix(cidOrURI) {
    if (cidOrURI.startsWith('ipfs://')) {
        return cidOrURI.slice('ipfs://'.length);
    }
    return cidOrURI;
  }

  ensureIpfsUriPrefix(cidOrURI) {
    let uri = cidOrURI.toString();
    if (!uri.startsWith('ipfs://')) {
        uri = 'ipfs://' + cidOrURI;
    }
    // Avoid the Nyan Cat bug (https://github.com/ipfs/go-ipfs/pull/7930)
    if (uri.startsWith('ipfs://ipfs/')) {
      uri = uri.replace('ipfs://ipfs/', 'ipfs://');
    }
    return uri;
  }


}

  


