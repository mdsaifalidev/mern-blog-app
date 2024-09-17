import { useState, useEffect } from "react";
import axiosInstance from "../../axiosInstance";
import Header from "../../components/Header";
import Spinner from "../../components/Spinner";

const MyBlog = () => {
  const [blogs, setBlogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchBlogs = async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get("/api/v1/blogs");
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
          {blogs.length > 0 ? (
            blogs.map((blog) => (
              <div key={blog._id} className="group">
                <div className="max-w-sm h-full bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                  <img
                    className="rounded-t-lg w-full"
                    alt={blog.image}
                    src={blog.image}
                  />
                  <div className="p-5">
                    <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                      {blog.title}
                    </h5>
                    <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
                      {blog.content}
                    </p>
                    {blog.status === "rejected" && (
                      <>
                        <div className="inline-flex items-center rounded-md bg-blue-50 px-2 py-2 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                          Status: {blog.status}
                        </div>
                        {blog.comment && (
                          <div className="inline-flex mt-2 items-center rounded-md bg-blue-50 px-2 py-2 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                            Comment: {blog.comment}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <h4 className="text-2xl font-bold">No Blogs Found!</h4>
          )}
        </div>
      </div>
    </>
  );
};

export default MyBlog;
