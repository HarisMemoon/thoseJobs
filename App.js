import AppNavigator from "./src/navigation/AppNavigator";
import { AuthProvider } from "./src/context/AuthContext";
import { Provider as PaperProvider } from "react-native-paper";
import { CustomTheme } from "./src/constants/Colors";
import Toast from "react-native-toast-message";

export default function App() {
  return (
    <PaperProvider theme={CustomTheme}>
      <AuthProvider>
        <AppNavigator />
        <Toast />
      </AuthProvider>
    </PaperProvider>
  );
}
