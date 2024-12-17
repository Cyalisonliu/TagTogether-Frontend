import { useOutletContext } from "react-router-dom";
import React, { useCallback } from "react";

export const useApi = () => {
  const { jwtToken } = useOutletContext();

  const fetchWithToken = useCallback(
    async (url, options = {}) => {
      // options: 请求的其他选项，例如 method 和 body，默认为空对象 {}
      const headers = {
        ...options.headers,
        Authorization: `Bearer ${jwtToken}`,
      };
      const baseUrl = import.meta.env.VITE_BACKEND_URL;
      return fetch(`${baseUrl}${url}`, { ...options, headers });
    },
    [jwtToken]
  );

  return { fetchWithToken };
};
