import { useState, useEffect } from "react";
import axiosInstance from "../axiosInstance";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Spinner from "../components/Spinner";

const Home = () => {
  const [blogs, setBlogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchBlogs = async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get(`/api/v1/blogs/approved`);
      setBlogs(response.data.data);
    } catch (error) {
      setBlogs([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  if (isLoading) {
    return <Spinner />;
  }
  return (
    <>
      <Header />
      <div className="mt-5 mx-auto max-w-7xl px-4">
        <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
          {blogs.map((blog) => (
            <div key={blog._id} className="group">
              <div className="max-w-sm h-full bg-white border border-gray-200 rounded-lg shadow">
                <img
                  className="rounded-t-lg w-full"
                  alt={blog.image}
                  src={blog.image}
                />
                <div className="p-5">
                  <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900">
                    {blog.title}
                  </h5>
                  <p className="mb-3 font-normal text-gray-700">
                    {blog.content}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Home;
