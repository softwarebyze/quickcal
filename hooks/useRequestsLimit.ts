import { MMKV, useMMKVNumber } from "react-native-mmkv";

export const storage = new MMKV({
  id: "requests-storage",
  encryptionKey: "requests-key-123",
});

const REQUEST_LIMIT_KEY = "remainingRequests";
const INITIAL_REQUESTS = 5;

export function useRequestsLimit() {
  const [remainingRequests, setRemainingRequests] = useMMKVNumber(
    REQUEST_LIMIT_KEY,
    storage
  );

  // Initialize on first run
  if (remainingRequests === undefined) {
    setRemainingRequests(INITIAL_REQUESTS);
  }

  const decrementRequests = () => {
    const current = remainingRequests ?? 0;
    const newCount = Math.max(0, current - 1);
    setRemainingRequests(newCount);
    return newCount;
  };

  return {
    remainingRequests: remainingRequests ?? 0,
    decrementRequests,
  };
}
