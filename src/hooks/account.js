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
    localStorage.removeItem("connect");
    localStorage.removeItem("position");
  }

  function getUsdcContract() {
    if (!usdcContract) {
      usdcContract = new Contract(
        "0x04068da6c83afcfa0e13ba15a6696662335d5b75",
        ["function balanceOf(address owner) view returns (uint balance)"],
        provider
      );
    }
    return usdcContract;
  }

  async function getUsdcBalance() {
    // get usdc balance
    return getUsdcContract().balanceOf(account.value);
  }

  return {
    connect,
    disconnect,
    connected,
    account,
    getProvider: () => provider,
    getSigner: () => provider?.getSigner(),
    getUsdcBalance,
  };
}
