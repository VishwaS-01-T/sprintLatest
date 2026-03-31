import useToastStore from "../store/toastStore";
import { useCallback, useMemo } from "react";

export function useToast() {
  const push = useToastStore((s) => s.push);

  const success = useCallback(
    (message, title = "Success") => push({ type: "success", title, message }),
    [push],
  );
  const error = useCallback(
    (message, title = "Something went wrong") =>
      push({ type: "error", title, message }),
    [push],
  );
  const info = useCallback(
    (message, title = "Info") => push({ type: "info", title, message }),
    [push],
  );

  return useMemo(() => ({ success, error, info }), [success, error, info]);
}
