import { ref } from "vue";
import { ethers, Contract } from "ethers";
import leveragerAbi from "./leverager-abi.json";

export function useLeverage({
  account,
  getProvider,
  getSigner,
  loops,
  slippage,
  collatRatio,
}) {
  let usdcContract = null;
  let leveragerContract = null;

  function getLeveragerContract() {
    if (!leveragerContract) {
      leveragerContract = new Contract(
        "0x8Cb11D692bdC1720B3e346c856BA74201bAb38Bc",
        leveragerAbi,
        getSigner()
      );
    }
    return leveragerContract;
  }

  // optimistically load saved position
  const positionAddress = ref(localStorage.getItem("position"));

  async function initialisePosition() {
    await getLeveragerContract().initialisePosition();
    return getPositionAddress();
  }

  function setPositionAddress(addr) {
    positionAddress.value = addr;
    if (addr) {
      localStorage.setItem("position", addr);
    } else {
      localStorage.removeItem("position");
    }
  }

  async function getPositionAddress() {
    const addr = await getLeveragerContract().getPositionAddress(account.value);
    setPositionAddress(addr);
  }

  function getPositionInfo(_loops = null, _slippage = null) {
    return getLeveragerContract().getPositionInfo(
      _loops ?? loops.value,
      _slippage ?? slippage.value,
      collatRatio.value
    );
  }

  function maxLeverageWithLoops(loops, slippage) {
    return getLeveragerContract().maxLeverageWithLoops(loops, slippage);
  }

  return {
    initialisePosition,
    getPositionAddress,
    setPositionAddress,
    getPositionInfo,
    positionAddress,
    getPositionInfo,
    maxLeverageWithLoops,
  };
}
