import { reactive, ref } from "@vue/reactivity";
import { watch } from "vue";

import { useAccount } from "./account";
import { useLeverage } from "./leverage";
import { usePosition } from "./position";

export function useRoboVault({ toast }) {
  const tokenAmount = ref("");
  const slippage = ref(
    JSON.parse(localStorage.getItem("user-picked-swap-tolerance") ?? "1")
  );
  const loops = ref(1);
  const collatRatio = ref(70);

  // auto refreshing stats
  const statsInterval = ref(null);
  const stats = reactive(
    JSON.parse(localStorage.getItem("position-stats")) ?? {
      collateral: null,
      profit: null,
      price: null,
      leverage: null,
      liquidationPrice: null,
      usdcBalance: null,
      open: null,
    }
  );

  const estimate = reactive({
    leverage: null,
    liquidationPrice: null,
    maxLeverage: null,
  });

  watch(stats, (newStats) => {
    localStorage.setItem("position-stats", JSON.stringify(newStats));
  });

  watch([loops, slippage], ([loops, slippage]) => {
    updateEstimate(loops, slippage);
  });

  const {
    connect,
    connected,
    disconnect,
    account,
    getProvider,
    getSigner,
    getUsdcBalance,
    approveUSDC,
    allowanceUSDC,
  } = useAccount();

  const {
    initialisePosition,
    getPositionAddress,
    setPositionAddress,
    positionAddress,
    getPositionInfo,
    maxLeverageWithLoops,
  } = useLeverage({
    account,
    getProvider,
    getSigner,
    loops,
    slippage,
    collatRatio,
  });

  const {
    openLong,
    closeLong,
    getCollateral,
    getProfit,
    getPrice,
    getLeverage,
    valueInBase,
    valueInQuote,
    depositCollateral,
    isOpen,
  } = usePosition({
    positionAddress,
    getProvider,
    getSigner,
    loops,
    slippage,
    collatRatio,
  });

  async function logout() {
    disconnect();
    loops.value = 1;
    tokenAmount.value = 0;
    setPositionAddress(null);
    clearStats();
    toast.info("Disconnected");
  }

  async function login() {
    await connect();
    try {
      await getPositionAddress();
      await beginStatsInterval();
      toast.info("Position Restored");
    } catch {
      updateEstimate(loops.value, slippage.value);
      toast.info("Connected");
    } finally {
      ethereum.on("accountsChanged", () => {
        logout();
        login();
      });
    }
  }
  async function initialise() {
    console.log("initialising...");
    await connect();
    try {
      await getPositionAddress();
    } catch {
      await initialisePosition();
      await getPositionAddress();
    }
    
    beginStatsInterval();
  }

  function toNumber(num, decimals = 0) {
    const scale = Math.pow(10, decimals)
    return parseFloat(num.toString()) / scale
  }

  function beginStatsInterval() {
    clearInterval(statsInterval.value);
    statsInterval.value = setInterval(getStats, 5000);
    return getStats();
  }

  async function getStats() {
    stats.open = await isOpen()
    if (stats.open) {
      const [
        { leverage: _leverage, liquidationPrice },
        leverage,
        collateral,
        profit,
        price,
        usdcBalance,
      ] = await Promise.all([
        getPositionInfo(),
        getLeverage(),
        getCollateral(),
        getProfit(),
        getPrice(),
        getUsdcBalance(),
      ]);
      stats.collateral = collateral / 1e6;
      stats.profit = Number(profit) / 1e6;
      stats.price = Number(price) / 1e6;
      stats.leverage = Number(leverage) / 1e18;
      stats.liquidationPrice = Number(liquidationPrice) / 1e2;
      stats.usdcBalance = Number(usdcBalance) / 1e6;
    } else {
      collatRatio.value = 60 // TODO - Set in UI. Max is 70%
      const [
        { levereage, liquidationPrice },
        price,
        usdcBalance,
      ] = await Promise.all([
        getPositionInfo(loops.value, slippage.value, collatRatio.value),
        getPrice(),
        getUsdcBalance(),
      ]);

      stats.leverage = Number(levereage) / 1e18;
      stats.liquidationPrice = Number(liquidationPrice) / 1e18;
      stats.price = Number(price) / 1e6;
      stats.usdcBalance = Number(usdcBalance) / 1e6;
    }
    console.log('getStats')
    console.log({ ...stats });
  }

  function clearStats() {
    clearInterval(statsInterval.value);
    stats.collateral = null;
    stats.profit = null;
    stats.price = null;
    stats.leverage = null;
    stats.liquidationPrice = null;
    stats.usdcBalance = null;
  }
  async function open() {
    try {
      const allowance = (await allowanceUSDC(positionAddress.value)) / 1e6;
      if (allowance < tokenAmount.value) {
        const approvalTx = await approveUSDC(
          positionAddress.value,
          tokenAmount.value
        );
        await approvalTx.wait();
      }

      const tx = await openLong(tokenAmount.value, loops.value, slippage.value);
      console.log({ tx });
      const { dismiss } = toast.success("Opening Position", {
        onClick() {
          window.open(`https://ftmscan.com/tx/${tx.hash}`, "_blank").focus();
        },
      });
      const resp = await tx.wait();
      console.log({ resp });
      dismiss();
      toast.success("Position Opened", {
        onClick() {
          window.open(`https://ftmscan.com/tx/${tx.hash}`, "_blank").focus();
        },
      });
    } catch (err) {
      console.error(err);
      toast.error("Failed to open position");
    }
  }

  async function deposit() {
    try {
      const tx = await depositCollateral(tokenAmount.value);
      console.log({ tx });
      const { dismiss } = toast.success("Deposition Collateral", {
        onClick() {
          window.open(`https://ftmscan.com/tx/${tx.hash}`, "_blank").focus();
        },
      });
      const resp = tx.wait();
      console.log({ resp });
      dismiss();
      toast.success(`Collateral Deposited $${tokenAmount.value}`, {
        onClick() {
          window.open(`https://ftmscan.com/tx/${tx.hash}`, "_blank").focus();
        },
      });
    } catch (err) {
      console.error(err);
      toast.error("Could not Deposit Collateral");
    }
  }
  async function close() {
    console.log("closing with 10 loops");
    try {
      const tx = await closeLong(slippage.value, 10);
      console.log({ tx });
      const { dismiss } = toast.success("Closing Position", {
        onClick() {
          window.open(`https://ftmscan.com/tx/${tx.hash}`, "_blank").focus();
        },
      });
      const resp = tx.wait();
      console.log({ resp });
      dismiss();
      toast.success("Position Closed", {
        onClick() {
          window.open(`https://ftmscan.com/tx/${tx.hash}`, "_blank").focus();
        },
      });
    } catch (err) {
      console.error(err);
      toast.error("Could not close position");
    }
  }

  async function getEstimate(loops, slippage) {
    collatRatio.value = 50
    const [{ levereage, liquidationPrice }, maxLeverage] = await Promise.all([
      getPositionInfo(loops, slippage, collatRatio.value),
      maxLeverageWithLoops(loops, slippage),
    ]);
    return {
      leverage: Number(levereage) / 1e18,
      liquidationPrice: Number(liquidationPrice)  / 1e18,
      maxLeverage: Number(maxLeverage),
    };
  }

  async function updateEstimate(loops, slippage) {
    console.log(loops, slippage)
    const { leverage, liquidationPrice, maxLeverage } = await getEstimate(
      loops,
      slippage
    );

    estimate.leverage = leverage / 1e18;
    estimate.liquidationPrice = liquidationPrice / 1e2;
    estimate.maxLeverage = maxLeverage / 1e18;
  }

  if (account.value) {
    login();
  }

  return {
    // auth functions
    logout,
    login,
    initialise,
    connected,

    // user
    account,
    stats,
    estimate,

    // inputs
    loops,
    slippage,
    collatRatio,
    tokenAmount,

    // position
    positionAddress,
    open,
    close,
    deposit,
    getEstimate,
    // withdraw
  };
}
