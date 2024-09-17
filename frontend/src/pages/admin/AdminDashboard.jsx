import { useState, useEffect } from "react";
import axiosInstance from "../../axiosInstance";
import Header from "../../components/Header";
import Spinner from "../../components/Spinner";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

const AdminDashboard = () => {
  const [blogs, setBlogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(null);
  const [currentBlogId, setCurrentBlogId] = useState(null);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

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

  const onSubmit = async (data) => {
    setIsLoading(true);
    const toastId = toast.loading("Please Wait...");
    try {
      const response = await axiosInstance.put(
        `/api/v1/blogs/${currentBlogId}/admin`,
        data
      );
      setIsUpdating(null);
      toast.success(response.data.message, { id: toastId });
      fetchBlogs();
    } catch (error) {
      toast.error(error.response.data.message || "Something went wrong.", {
        id: toastId,
      });
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
          {blogs.map((blog, index) => (
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
                  {isUpdating === index ? (
                    <form onSubmit={handleSubmit(onSubmit)}>
                      <div>
                        <label
                          htmlFor="status"
                          className="block text-sm font-medium leading-6"
                        >
                          Status
                        </label>
                        <div className="mt-2">
                          <select
                            id="status"
                            {...register("status")}
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                          >
                            <option value="pending">Pending</option>
                            <option value="approved">Approved</option>
                            <option value="rejected">Rejected</option>
                          </select>
                        </div>
                      </div>
                      <div>
                        <label
                          htmlFor="comment"
                          className="block text-sm font-medium leading-6 text-gray-900"
                        >
                          Comment
                        </label>
                        <div className="mt-2">
                          <textarea
                            id="comment"
                            name="comment"
                            rows={3}
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            {...register("comment")}
                          />
                        </div>
                        <button
                          type="submit"
                          className="flex mt-2 w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        >
                          Update Now
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div>
                      <div className="inline-flex items-center rounded-md bg-blue-50 px-2 py-2 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                        Status: {blog.status}
                      </div>
                      {blog.comment && (
                        <div className="inline-flex mt-2 items-center rounded-md bg-blue-50 px-2 py-2 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                          Comment: {blog.comment}
                        </div>
                      )}
                      <button
                        onClick={() => {
                          setCurrentBlogId(blog._id);
                          setValue("status", blog.status);
                          setValue("comment", blog.comment);
                          setIsUpdating(index);
                        }}
                        className="flex w-full mt-2 justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                      >
                        Edit
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
