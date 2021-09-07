import { ethers, Contract, BigNumber } from "ethers";
import positionAbi from "./position-abi.json";
export function usePosition({
  positionAddress,
  getProvider,
  getSigner,
  loops,
  slippage,
  collatRatio,
}) {
  let positionContract = null;
  function getPositionContract() {
    if (!positionContract) {
      positionContract = new Contract(
        positionAddress.value,
        positionAbi,
        getSigner()
      );
    }
    return positionContract;
  }

  function openLong(quoteAmount) {
    return getPositionContract().openLong(
      (quoteAmount * 1e6).toString(),
      loops.value.toString(),
      (slippage.value * 10 ** 16).toString(),
      (collatRatio.value * 10 ** 16).toString()
    );
  }
  function closeLong(slippage = slippage.value, loops = loops.value) {
    console.log((slippage * 10 ** 16).toString(), loops.toString());
    return getPositionContract().closeAndWithdraw(
      (slippage * 10 ** 16).toString(),
      loops.toString()
    );
  }
  function getCollateral() {
    return getPositionContract().getCollateral();
  }
  function getProfit() {
    return getPositionContract().getProfit();
  }
  function getPrice() {
    return getPositionContract().getPrice();
  }
  function getLeverage() {
    return getPositionContract().getLeverage();
  }
  function valueInBase() {
    return getPositionContract().getLeverage();
  }
  function valueInQuote() {
    return getPositionContract().getLeverage();
  }
  function depositCollateral(amount) {
    return getPositionContract().depositCollateral(
      (amount * 1e6).toString(),
      (slippage.value * 10 ** 16).toString()
    );
  }
  function isOpen() {
    return getPositionContract().isOpen()
  }

  return {
    openLong,
    closeLong,
    getCollateral,
    getLeverage,
    getProfit,
    getPrice,
    valueInBase,
    valueInQuote,
    depositCollateral,
    isOpen,
  };
}
