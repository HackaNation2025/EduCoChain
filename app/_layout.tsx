import "../src/polyfills/crypto"; // deve ser o primeiro
import { Stack } from "expo-router";
import { WalletProvider } from "../src/wallet/walletProvider";

export default function Layout() {
  return (
    <WalletProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="menu" />
        <Stack.Screen name="publico/detalhes" />
        <Stack.Screen name="publico/votar" />
        <Stack.Screen name="publico/recompensa" />
        <Stack.Screen name="governo/menuGoverno" />
      </Stack>
    </WalletProvider>
  );
}
