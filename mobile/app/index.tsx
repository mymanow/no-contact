import { Redirect } from "expo-router";

// Temporaire : tant que les écrans ne sont pas construits, l'app ouvre le design system.
export default function Index() {
  return <Redirect href="/design" />;
}
