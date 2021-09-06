import { computed, ref } from "vue";
import { ethers, Contract } from "ethers";

export function useAccount() {
  const account = ref(localStorage.getItem("connect"));
  const connected = computed(() => !!account.value);
  let provider = null;
  let usdcContract = null;

  async function connect() {
    const accounts = await ethereum.request({ method: "eth_requestAccounts" });
    account.value = accounts[0];
    provider = new ethers.providers.Web3Provider(window.ethereum);
    localStorage.setItem("connect", accounts[0]);
  }

  function disconnect() {
    account.value = null;
    localStorage.clear();
  }

  function getUsdcContract() {
    if (!usdcContract) {
      usdcContract = new Contract(
        "0x04068da6c83afcfa0e13ba15a6696662335d5b75",
        [
          "function balanceOf(address owner) view returns (uint balance)",
          "function allowance(address owner, address spender) view returns (uint256)",
          "function approve(address spender, uint256 amount) returns (bool)",
        ],
        provider.getSigner()
      );
    }
    return usdcContract;
  }

  async function getUsdcBalance() {
    // get usdc balance
    return getUsdcContract().balanceOf(account.value);
  }

  async function allowanceUSDC(spender) {
    return getUsdcContract().allowance(account.value, spender);
  }

  async function approveUSDC(spender, amount) {
    return getUsdcContract().approve(spender, (amount * 1e6).toString());
  }

  return {
    connect,
    disconnect,
    connected,
    account,
    getProvider: () => provider,
    getSigner: () => provider?.getSigner(),
    approveUSDC,
    allowanceUSDC,
    getUsdcBalance,
  };
}
