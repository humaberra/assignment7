import { useEffect, useReducer } from "react";

const initialState = { loading: true, error: null, data: null };

function fetchReducer(state, action) {
  switch (action.type) {
    case "FETCH_START":
      return { loading: true, error: null, data: null };
    case "FETCH_SUCCESS":
      return { loading: false, error: null, data: action.payload };
    case "FETCH_ERROR":
      return { loading: false, error: action.payload, data: null };
    default:
      throw new Error(`Unknown action: ${action.type}`);
  }
}

/**
 * useFetch(fetcher, deps)
 * fetcher: (signal) => Promise<data>
 * deps:    the inputs the request depends on (for example [id])
 * Every component that calls this hook gets its OWN state.
 */
export default function useFetch(fetcher, deps) {
  const [state, dispatch] = useReducer(fetchReducer, initialState);

  useEffect(() => {
    const controller = new AbortController();
    dispatch({ type: "FETCH_START" });

    fetcher(controller.signal)
      .then((data) => dispatch({ type: "FETCH_SUCCESS", payload: data }))
      .catch((error) => {
        // An aborted request is not a real error: the component moved on.
        if (error.name === "AbortError") return;
        dispatch({ type: "FETCH_ERROR", payload: error });
      });

    // Cleanup: cancel the in-flight request when deps change or on unmount.
    return () => controller.abort();
    // The caller decides what the request depends on, so deps are passed in.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return state;
}