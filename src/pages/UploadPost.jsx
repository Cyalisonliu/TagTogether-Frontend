import React, { useState } from "react";
import { useApi } from "../hooks/useApi";

const UploadPost = () => {
  const [content, setContent] = useState(""); // 存储贴文内容
  const [alertClassName, setAlertClassName] = useState("hidden"); // 状态消息样式
  const [alertMessage, setAlertMessage] = useState(""); // 状态消息内容
  const { fetchWithToken } = useApi(); // 使用 fetchWithToken 替代原生 fetch

  // 提交贴文
  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const payload = { content }; // 发送到后端的数据
      const response = await fetchWithToken("/api/user/upload-post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setAlertClassName(
          "bg-green-600 text-white p-4 rounded border border-green-700"
        );
        setAlertMessage("Post uploaded successfully!");
        setContent(""); // 清空输入框
      } else {
        const data = await response.json();
        setAlertClassName(
          "bg-red-600 text-white p-4 rounded border border-red-700"
        );
        setAlertMessage(data.detail || "Failed to upload post.");
      }
    } catch (error) {
      console.error("Error uploading post:", error);
      setAlertClassName(
        "bg-red-600 text-white p-4 rounded border border-red-700"
      );
      setAlertMessage("An error occurred while uploading.");
    }
  };

  return (
    <div className="max-w-lg p-6 mx-auto mt-12 text-gray-100 bg-gray-900 rounded shadow-lg">
      <h2 className="mb-6 text-2xl font-bold text-purple-400">Upload Post</h2>

      {alertMessage && (
        <p className={`mb-6 ${alertClassName}`}>{alertMessage}</p>
      )}

      <form onSubmit={handleSubmit}>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your post content here..."
          className="w-full h-40 p-4 text-gray-200 placeholder-gray-400 bg-gray-800 border border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-purple-600"
        />
        <button
          type="submit"
          className="w-full py-3 mt-4 text-lg font-semibold text-white transition bg-purple-600 rounded hover:bg-purple-700"
        >
          Upload
        </button>
      </form>
    </div>
  );
};

export default UploadPost;
