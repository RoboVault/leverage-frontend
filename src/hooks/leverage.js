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

  async function getPositionAddress() {
    positionAddress.value = await getLeveragerContract().getPositionAddress(
      account.value
    );
    localStorage.setItem("position", positionAddress.value);
  }

  function getPositionInfo() {
    return getLeveragerContract().getPositionInfo(
      loops.value,
      slippage.value,
      collatRatio.value
    );
  }

  return {
    initialisePosition,
    getPositionAddress,
    getPositionInfo,
    positionAddress,
    getPositionInfo,
  };
}
