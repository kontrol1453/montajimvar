import React, { useRef, useState, useCallback, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  Platform,
  Share,
  Animated,
  Linking,
  BackHandler,
} from "react-native";
import { WebView, type WebViewNavigation } from "react-native-webview";

const APP_URL = "https://montajimvar.xyz";
const STATUS_BAR_HEIGHT = Platform.OS === "ios" ? 44 : 0;

export default function App() {
  const webViewRef = useRef<WebView>(null);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [canGoBack, setCanGoBack] = useState(false);
  const [canGoForward, setCanGoForward] = useState(false);
  const [currentUrl, setCurrentUrl] = useState(APP_URL);
  const splashOpacity = useRef(new Animated.Value(1)).current;

  // Splash screen fade-out on first load
  useEffect(() => {
    if (!loading) {
      Animated.timing(splashOpacity, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }).start();
    }
  }, [loading, splashOpacity]);

  // Handle Android back button
  useEffect(() => {
    const onBackPress = () => {
      if (webViewRef.current && canGoBack) {
        webViewRef.current.goBack();
        return true;
      }
      return false;
    };
    BackHandler.addEventListener("hardwareBackPress", onBackPress);
    return () =>
      BackHandler.removeEventListener("hardwareBackPress", onBackPress);
  }, [canGoBack]);

  const handleNavigationStateChange = useCallback(
    (navState: WebViewNavigation) => {
      setCanGoBack(navState.canGoBack);
      setCanGoForward(navState.canGoForward);
      setCurrentUrl(navState.url);
    },
    []
  );

  const handleShare = useCallback(async () => {
    try {
      await Share.share({
        message: `Montajım Var - ${currentUrl}`,
        url: currentUrl,
        title: "Montajım Var",
      });
    } catch {
      // user cancelled
    }
  }, [currentUrl]);

  const handleRefresh = useCallback(() => {
    setLoading(true);
    webViewRef.current?.reload();
  }, []);

  const handleOpenInBrowser = useCallback(() => {
    Linking.openURL(currentUrl);
  }, [currentUrl]);

  const injectedJS = `
    // iOS için viewport meta fix
    (function() {
      var meta = document.querySelector('meta[name="viewport"]');
      if (meta) {
        meta.content = 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover';
      }
      // Dark mode scrollbar
      var style = document.createElement('style');
      style.innerHTML = '::-webkit-scrollbar { width: 0; }';
      document.head.appendChild(style);
    })();
    true;
  `;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0a0a0a" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity
            onPress={() => webViewRef.current?.goBack()}
            disabled={!canGoBack}
            style={[styles.headerBtn, !canGoBack && styles.headerBtnDisabled]}
          >
            <Text style={[styles.headerBtnText, !canGoBack && styles.headerBtnTextDisabled]}>
              ◀
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => webViewRef.current?.goForward()}
            disabled={!canGoForward}
            style={[styles.headerBtn, !canGoForward && styles.headerBtnDisabled]}
          >
            <Text style={[styles.headerBtnText, !canGoForward && styles.headerBtnTextDisabled]}>
              ▶
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.headerTitle} numberOfLines={1}>
          Montajım Var
        </Text>

        <View style={styles.headerRight}>
          <TouchableOpacity onPress={handleShare} style={styles.headerBtn}>
            <Text style={styles.headerBtnText}>↗</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleOpenInBrowser}
            style={styles.headerBtn}
          >
            <Text style={styles.headerBtnText}>🌐</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Progress Bar */}
      {loading && (
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${progress}%` }]} />
        </View>
      )}

      {/* WebView */}
      <WebView
        ref={webViewRef}
        source={{ uri: APP_URL }}
        style={styles.webview}
        onNavigationStateChange={handleNavigationStateChange}
        onLoadProgress={({ nativeEvent }) => setProgress(nativeEvent.progress)}
        onLoadEnd={() => setLoading(false)}
        onError={() => setLoading(false)}
        injectedJavaScript={injectedJS}
        javaScriptEnabled
        domStorageEnabled
        startInLoadingState
        allowsBackForwardNavigationGestures
        allowsInlineMediaPlayback
        mediaPlaybackRequiresUserAction={false}
        sharedCookiesEnabled
        thirdPartyCookiesEnabled
        pullToRefreshEnabled
        decelerationRate="normal"
        hideKeyboardAccessoryView={false}
        allowsLinkPreview
        setSupportMultipleWindows={false}
      />

      {/* Splash Screen */}
      {Platform.OS === "ios" && (
        <Animated.View
          pointerEvents={loading ? "auto" : "none"}
          style={[styles.splash, { opacity: splashOpacity }]}
        >
          <Text style={styles.splashIcon}>🔧</Text>
          <Text style={styles.splashTitle}>Montajım Var</Text>
          <Text style={styles.splashSubtitle}>Yükleniyor...</Text>
          <ActivityIndicator
            size="large"
            color="#ff7a00"
            style={styles.splashLoader}
          />
        </Animated.View>
      )}

      {/* Refresh button overlay when not loading but showing cached page */}
      {!loading && progress < 1 && (
        <TouchableOpacity style={styles.refreshOverlay} onPress={handleRefresh}>
          <Text style={styles.refreshText}>⟳ Yenile</Text>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0a0a0a",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#0d0d0d",
    paddingHorizontal: 8,
    paddingVertical: Platform.OS === "ios" ? 6 : 4,
    borderBottomWidth: 1,
    borderBottomColor: "#222",
    height: Platform.OS === "ios" ? 48 : 44,
  },
  headerLeft: {
    flexDirection: "row",
    gap: 4,
    minWidth: 72,
  },
  headerRight: {
    flexDirection: "row",
    gap: 4,
    minWidth: 72,
    justifyContent: "flex-end",
  },
  headerTitle: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "600",
    flex: 1,
    textAlign: "center",
  },
  headerBtn: {
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 6,
  },
  headerBtnDisabled: {
    opacity: 0.3,
  },
  headerBtnText: {
    color: "#ff7a00",
    fontSize: 16,
  },
  headerBtnTextDisabled: {
    color: "#555",
  },
  progressBar: {
    height: 2,
    backgroundColor: "#222",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#ff7a00",
  },
  webview: {
    flex: 1,
    backgroundColor: "#0a0a0a",
  },
  splash: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#0a0a0a",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
  },
  splashIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  splashTitle: {
    color: "#ff7a00",
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 8,
  },
  splashSubtitle: {
    color: "#888",
    fontSize: 14,
  },
  splashLoader: {
    marginTop: 24,
  },
  refreshOverlay: {
    position: "absolute",
    bottom: 20,
    alignSelf: "center",
    backgroundColor: "#ff7a00",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    zIndex: 5,
  },
  refreshText: {
    color: "#0a0a0a",
    fontWeight: "600",
    fontSize: 14,
  },
});
