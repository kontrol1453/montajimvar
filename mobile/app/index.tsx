import { useEffect, useRef, useState } from "react";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import { WebView } from "react-native-webview";
import * as Linking from "expo-linking";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { StatusBar } from "expo-status-bar";

const APP_URL = "https://montajimvar.xyz";

export default function HomeScreen() {
  const webviewRef = useRef<WebView>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    registerPushNotifications();

    const handleDeepLink = (event: { url: string }) => {
      const path = Linking.parse(event.url).path;
      if (path && webviewRef.current) {
        webviewRef.current.injectJavaScript(`
          window.location.href = '${APP_URL}/${path}';
          true;
        `);
      }
    };

    const subscription = Linking.addEventListener("url", handleDeepLink);
    return () => subscription.remove();
  }, []);

  async function registerPushNotifications() {
    if (!Device.isDevice) return;

    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== "granted") return;

    const token = await Notifications.getExpoPushTokenAsync();
    console.log("Push token:", token.data);

    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
      }),
    });

    Notifications.addNotificationResponseReceivedListener((response) => {
      const data = response.notification.request.content.data;
      if (data?.url && webviewRef.current) {
        webviewRef.current.injectJavaScript(`
          window.location.href = '${APP_URL}${data.url}';
          true;
        `);
      }
    });
  }

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <WebView
        ref={webviewRef}
        source={{ uri: APP_URL }}
        style={styles.webview}
        onLoadEnd={() => setLoading(false)}
        startInLoadingState
        javaScriptEnabled
        domStorageEnabled
        allowsBackForwardNavigationGestures
        allowsInlineMediaPlayback
        mediaPlaybackRequiresUserAction={false}
        sharedCookiesEnabled
        onShouldStartLoadWithRequest={(request) => {
          if (request.url.startsWith(APP_URL)) return true;
          Linking.openURL(request.url);
          return false;
        }}
      />
      {loading && (
        <View style={styles.loading}>
          <ActivityIndicator size="large" color="#0B5FFF" />
          <Text style={styles.loadingText}>Montajım Var yükleniyor...</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#1a1d27" },
  webview: { flex: 1, backgroundColor: "transparent" },
  loading: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1a1d27",
    gap: 12,
  },
  loadingText: { color: "#98a2b3", fontSize: 14 },
});
