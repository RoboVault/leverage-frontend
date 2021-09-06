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
    }
  );

  watch(stats, (newStats) => {
    localStorage.setItem("position-stats", JSON.stringify(newStats));
  });

  const {
    connect,
    connected,
    disconnect,
    account,
    getProvider,
    getSigner,
    getUsdcBalance,
  } = useAccount();

  const {
    initialisePosition,
    getPositionAddress,
    positionAddress,
    getPositionInfo,
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
      toast.info("Connected");
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

  function beginStatsInterval() {
    statsInterval.value = setInterval(getStats, 5000);
    return getStats();
  }

  async function getStats() {
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
    try {
      const ts = await closeLong(slippage.value, loops.value);
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

  if (account.value) {
    initialise();
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
    // withdraw
  };
}
