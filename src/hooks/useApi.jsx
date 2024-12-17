import { useOutletContext } from "react-router-dom";
import React, { useCallback } from "react";

export const useApi = () => {
  const { jwtToken } = useOutletContext();

  const fetchWithToken = useCallback(
    async (url, options = {}) => {
      // options: 请求的其他选项，例如 method 和 body，默认为空对象 {}
      const headers = {
        ...options.headers, // 合并原有的请求头（options.headers）和新的 Authorization 头部
        Authorization: `Bearer ${jwtToken}`,
      };
      return fetch(url, { ...options, headers });
    },
    [jwtToken]
  );

  return { fetchWithToken };
};
