import { computed, ref } from "vue";

export function useAccount() {
    const account = ref(null)
    const connected = computed(() => !!account.value)

    async function connect() {
        const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
        account.value = accounts[0];
    }

    function disconnect() {
        account.value = null
    }

    return {
        connect,
        disconnect,
        connected,
        account
    }
}
