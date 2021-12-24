import { useState, useCallback, useEffect } from "react";
import useAPI from "../../hooks/useAPI";
import { CreateItem, DeleteItem, PatchItem, User } from "./types";

const BASE_PATH = "/user";

interface Options {
  disableAutomaticRefresh?: boolean;
}

export const useUserGetAll = (
  initialData: User[] = [],
  options: Options = {}
): [User[], boolean, () => Promise<void>] => {
  const { disableAutomaticRefresh } = options;

  const [data, setData] = useState(initialData);
  const [refreshInProgress, setRefreshInProgress] = useState(false);

  const refresh = useCallback(async () => {
    setRefreshInProgress(true);

    try {
      const res = await fetch(`/api${BASE_PATH}`);
      const json = await res.json();
      setData(json);
    } catch (error) {
      console.error(error);
    }

    setRefreshInProgress(false);
  }, []);

  useEffect(() => {
    if (disableAutomaticRefresh) return;

    const interval = setInterval(async () => {
      await refresh();
    }, 30_000);

    return () => clearInterval(interval);
  }, [refresh, disableAutomaticRefresh]);

  return [data, refreshInProgress, refresh];
};

export const useUserCreate = ({
  name,
}: CreateItem): [boolean, () => Promise<void>] => {
  const [data, isLoading, doFetch] = useAPI(BASE_PATH, {
    body: JSON.stringify({
      name,
    }),
    method: "POST",
  });

  return [isLoading, doFetch];
};

export const useUserRead = (
  id: User["id"]
): [User, boolean, () => Promise<void>] => {
  const [data, isLoading, doFetch] = useAPI(`${BASE_PATH}/${id}`, {
    method: "GET",
  });

  return [data, isLoading, doFetch];
};

export const useUserUpdate = (
  id: User["id"],
  { name }: PatchItem
): [boolean, () => Promise<void>] => {
  const [data, isLoading, doFetch] = useAPI(`${BASE_PATH}/${id}`, {
    body: JSON.stringify({
      name,
    }),
    method: "PATCH",
  });

  return [isLoading, doFetch];
};

export const useUserDelete = (
  id: DeleteItem
): [boolean, () => Promise<void>] => {
  const [data, isLoading, doFetch] = useAPI(`${BASE_PATH}/${id}`, {
    method: "DELETE",
  });

  return [isLoading, doFetch];
};

export const useUserArchive = (
  id: User["id"]
): [boolean, () => Promise<void>] => {
  const [data, isLoading, doFetch] = useAPI(`${BASE_PATH}/${id}/archive`, {
    method: "PATCH",
  });

  return [isLoading, doFetch];
};

export const useUserRestore = (
  id: User["id"]
): [boolean, () => Promise<void>] => {
  const [data, isLoading, doFetch] = useAPI(`${BASE_PATH}/${id}/restore`, {
    method: "PATCH",
  });

  return [isLoading, doFetch];
};
