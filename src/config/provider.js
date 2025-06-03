import { ethers } from "ethers";

// Endpoint oficial público da BNB Testnet
const provider = new ethers.JsonRpcProvider("https://data-seed-prebsc-1-s1.binance.org:8545/");

export default provider;
