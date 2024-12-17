import React, { useState, useEffect, useCallback } from "react";
import { useOutletContext } from "react-router-dom";
import { useApi } from "../hooks/useApi";
import coverImage from "../assets/cover.jpg";

function Home() {
  const [username, setUsername] = useState("");
  const [posts, setPosts] = useState([]);
  const { setAlertMessage, setAlertClassName } = useOutletContext();
  const { fetchWithToken } = useApi();

  const showAlert = useCallback(
    (message, className) => {
      setAlertMessage(message);
      setAlertClassName(className);
      setTimeout(() => {
        setAlertMessage("");
        setAlertClassName("hidden");
      }, 3000);
    },
    [setAlertMessage, setAlertClassName]
  );

  const fetchPosts = useCallback(async () => {
    try {
      const response = await fetchWithToken("/api/post/posts/");
      if (response.ok) {
        const data = await response.json();
        setPosts(data);
      } else {
        showAlert("Failed to fetch posts.", "alert-danger");
      }
    } catch (error) {
      console.log(error);
      showAlert("An error occurred while fetching posts.", "alert-danger");
    }
  }, [fetchWithToken, showAlert]);

  useEffect(() => {
    const fetchUsername = async () => {
      try {
        const response = await fetchWithToken("/api/user/me");
        if (response.ok) {
          const data = await response.json();
          setUsername(data.user_name);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchUsername();
  }, [fetchWithToken]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  return (
    <div className="min-h-screen text-gray-200 bg-black">
      {/* 图片横幅区域 */}
      <div className="relative group">
        {/* 图片 */}
        <img
          src={coverImage}
          alt="Cover"
          className="object-cover w-full h-auto"
        />
        {/* 遮罩和文字，仅在悬停时显示 */}
        <div className="absolute inset-0 flex items-center justify-center transition-all duration-300 bg-black bg-opacity-0 group-hover:bg-opacity-50">
          <h2 className="text-4xl font-extrabold transition-opacity duration-300 opacity-0 text-gold-400 group-hover:opacity-100">
            Hello, {username || "Guest"}!
          </h2>
        </div>
      </div>

      {/* 帖子流 */}
      <div className="p-6 bg-gray-800">
        {posts.length > 0 ? (
          posts.map((post) => (
            <div
              key={post.id}
              className="p-4 mb-4 bg-gray-900 border rounded-lg shadow-lg border-gold-400"
            >
              <h2 className="text-lg font-bold text-purple-400">
                {post.user_name}
              </h2>
              <p className="text-sm text-gray-300">{post.content}</p>
              <span className="text-xs text-gray-500">
                {new Date(post.timestamp).toLocaleString()}
              </span>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-400">
            No posts yet. Be the first to post!
          </p>
        )}
      </div>
    </div>
  );
}

export default Home;
