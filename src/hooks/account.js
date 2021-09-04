import { computed, ref } from "vue";
import { ethers, Contract } from "ethers";

export function useAccount() {
  const account = ref(localStorage.getItem("connect"));
  const connected = computed(() => !!account.value);
  let provider = null;

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

  return {
    connect,
    disconnect,
    connected,
    account,
    getProvider: () => provider,
    getSigner: () => provider?.getSigner(),
  };
}
