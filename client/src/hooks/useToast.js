import { useCallback, useMemo } from "react";
import showToast from "../utils/toast";

/**
 * useToast hook - wrapper around react-hot-toast for backward compatibility
 * Provides success, error, and info methods
 */
export function useToast() {
  const success = useCallback(
    (message) => showToast.success(message),
    [],
  );
  const error = useCallback(
    (message) => showToast.error(message),
    [],
  );
  const info = useCallback(
    (message) => showToast.info(message),
    [],
  );

  return useMemo(() => ({ success, error, info }), [success, error, info]);
}
