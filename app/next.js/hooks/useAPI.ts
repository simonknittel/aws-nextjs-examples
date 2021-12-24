import { useCallback, useContext, useState } from "react";
import { CSRFContext } from "../modules/csrf";

interface Options extends RequestInit {}

// @TODO: Implement error handling
const useAPI = (
  url: string,
  options: Options
): [any, boolean, () => Promise<void>] => {
  const csrfToken = useContext(CSRFContext);
  const [data, setData] = useState();
  const [isLoading, setIsLoading] = useState(false);

  const doFetch = useCallback(async () => {
    setIsLoading(true);

    const init = { ...options };

    if (!init.headers) init.headers = new Headers();

    if (init.method && ["POST", "PATCH"].includes(init.method)) {
      setHeader(
        init.headers,
        "Content-Type",
        "application/json; charset=utf-8"
      );
    }

    if (
      init.method &&
      ["POST", "PATCH", "DELETE"].includes(init.method) &&
      csrfToken
    ) {
      setHeader(init.headers, "X-CSRF-Token", csrfToken);
    }

    const response = await fetch("/api" + url, init);

    if (
      response.headers.get("content-type") === "application/json; charset=utf-8"
    ) {
      const json = await response.json();
      setData(json);
    }

    setIsLoading(false);
  }, [url, options, csrfToken]);

  return [data, isLoading, doFetch];
};

export default useAPI;

function setHeader(headers: HeadersInit, key: string, value: string) {
  if (headers instanceof Headers) {
    headers.set(key, value);
  } else if (Array.isArray(headers)) {
    headers.push([key, value]);
  } else if (typeof headers === "object") {
    headers[key] = value;
  }
}
