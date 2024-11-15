
import { View, Text, Pressable, StyleSheet, Platform } from "react-native";

interface RemainingRequestsProps {
  remainingRequests: number;
}

export const RemainingRequests = ({ remainingRequests }: RemainingRequestsProps) => {
  if (remainingRequests > 3) return null;

  return (
    <View style={styles.warningContainer}>
      <Text style={styles.warningText} numberOfLines={1}>
        {remainingRequests === 0
          ? "No requests remaining"
          : `${remainingRequests} ${
              remainingRequests === 1 ? "request" : "requests"
            } remaining`}
      </Text>
      <Pressable style={styles.upgradeButton}>
        <Text style={styles.upgradeButtonText}>
          {remainingRequests === 0 ? "Upgrade Now" : "Upgrade"}
        </Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  warningContainer: {
    position: "absolute",
    bottom: Platform.OS === "ios" ? 120 : 80,
    alignSelf: "center",
    width: 320,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    backgroundColor: "#111",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
  },
  warningText: {
    color: "#888",
    fontSize: 14,
    fontWeight: "500",
    flex: 1,
  },
  upgradeButton: {
    backgroundColor: "#222",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    flexShrink: 0,
  },
  upgradeButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
});