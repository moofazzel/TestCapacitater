"use client";

import { deleteComment, updateComment } from "@/actions/comments";
import { formatCustomDate } from "@/utils/formatCustomDate";
import {
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
  User,
} from "@nextui-org/react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import CommentSkeleton from "./CommentSkeleton";

function AllDealComments({
  isCommentOption = false,
  dealId,
  newCommentState,
  setNewCommentState,
}) {
  const [comments, setComments] = useState([]);
  const [dealLogs, setDealLogs] = useState([]);

  const [loading, setLoading] = useState(true);

  const [editingCommentId, setEditingCommentId] = useState(null);
  const [newComment, setNewComment] = useState(null);

  useEffect(() => {
    async function fetchCommentsAndLogs() {
      try {
        const response = await fetch(`/api/comments?dealId=${dealId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch comments and logs");
        }

        const { comments, dealLogs } = await response.json();

        // Sort comments by createdAt in descending order
        const sortedComments = comments.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );

        // Sort deal logs by createdAt in descending order
        const sortedDealLogs = dealLogs.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );

        // Set comments and logs in state
        setComments(sortedComments);
        setDealLogs(sortedDealLogs); // Ensure `setDealLogs` is defined in your state
      } catch (error) {
        console.log("Error:", error);
        setLoading(false);
      } finally {
        setLoading(false);
      }
    }

    fetchCommentsAndLogs();
  }, [dealId, newCommentState]);

  // Handle edit comment
  const handleEditComment = async (commentId) => {
    try {
      setLoading(true);
      setNewCommentState(false);
      const res = await updateComment(dealId, commentId, newComment);
      if (res.success) {
        setNewCommentState(true);
        toast.success(res.message);
        setComments((prevComments) =>
          prevComments.map((comment) => {
            if (comment._id === commentId) {
              return { ...comment, comment: newComment };
            }
            return comment;
          })
        );
        setEditingCommentId(null);
      } else {
        toast.error(res.message);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log("🚀 ~ error:", error);
      toast.error(error.message);
    }
  };

  // Handle delete comment
  const handleDeleteComment = async (commentId) => {
    try {
      setLoading(true);
      const res = await deleteComment(dealId, commentId);

      if (res.success) {
        toast.success(res.message);
        setComments((prevComments) =>
          prevComments.filter((comment) => comment._id !== commentId)
        );
      } else {
        toast.error(res.message);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log("🚀 ~ error:", error);
      toast.error(error.message);
    }
  };

  return (
    <div>
      {/* Deal comments */}
      <div className="text-color02">
        {loading && <CommentSkeleton />}

        {comments?.length > 0 && (
          <>
            <div>Comments:</div>
            {comments.map((comment, i) => {
              const emailName = comment?.userId?.email.split("@")[0];

              return (
                <form key={comment._id}>
                  <div className="mt-2.5">
                    {i > 0 && <hr className="pb-2.5 border-[#b0b0b042]" />}
                    <div className="flex gap-1 items-center">
                      <User
                        as="button"
                        name={comment?.userId?.name || emailName}
                        className="capitalize"
                      />{" "}
                      :
                      <div className="text-[10px] text-gray-500">
                        {formatCustomDate(comment.createdAt)}
                        {comment?.isEdited && (
                          <span className="ml-1 text-[8px]">(Edited)</span>
                        )}
                      </div>
                    </div>

                    <div>
                      {editingCommentId === comment._id ? (
                        <textarea
                          className="p-2 mt-1 ml-[48px] text-[13px] w-[90%] h-20  border rounded-none bg-color10 border-color05 focus:outline-color5 focus:ring-0 focus:rounded-none"
                          defaultValue={comment.comment}
                          onChange={(e) => setNewComment(e.target.value)}
                        />
                      ) : (
                        <div className="mt-1 ml-[48px] text-[13px]">
                          {comment.comment}
                        </div>
                      )}
                    </div>
                  </div>
                  {/* comment options */}
                  {isCommentOption && (
                    <div className="mt-1 ml-[48px]">
                      {editingCommentId === comment._id ? (
                        <div className="mt-2">
                          <Button
                            onClick={() => handleEditComment(comment._id)}
                            isLoading={loading}
                            radius="none"
                            type="button"
                            color="success"
                          >
                            Save
                          </Button>
                          <Button
                            radius="none"
                            onClick={() => setEditingCommentId(null)}
                            type="button"
                            color="primary"
                            variant="flat"
                            className="ml-2 text-black"
                          >
                            Discard changes
                          </Button>
                        </div>
                      ) : (
                        <div className="space-x-2 text-xs">
                          <button
                            onClick={() => setEditingCommentId(comment._id)}
                            type="button"
                          >
                            Edit
                          </button>
                          <Popover
                            radius="none"
                            color="secondary"
                            placement="top-start"
                          >
                            <PopoverTrigger>
                              <button
                                type="button"
                                className="transition-colors duration-200 hover:text-red-500"
                              >
                                Delete
                              </button>
                            </PopoverTrigger>
                            {/* popover content */}
                            <PopoverContent className="text-black bg-white">
                              <div className="px-1 py-2">
                                <div className="text-xs font-bold text-center">
                                  Delete comment?
                                </div>
                                <div className="my-3 text-tiny">
                                  Deleting a comment is forever. There is no
                                  undo.
                                </div>
                                <Button
                                  onClick={() =>
                                    handleDeleteComment(comment._id)
                                  }
                                  radius="none"
                                  color="danger"
                                  className="w-full"
                                  isLoading={loading}
                                >
                                  Delete comment
                                </Button>
                              </div>
                            </PopoverContent>
                          </Popover>
                        </div>
                      )}
                    </div>
                  )}
                </form>
              );
            })}
          </>
        )}

        {dealLogs?.length > 0 && (
          <>
            {/* <div >Logs:</div> */}
            {comments.length > 0 && <hr className="mt-3.5 border-[#575757]" />}
            {dealLogs.map((log, i) => {
              return (
                <div className="mt-5" key={log._id}>
                  <div className="flex gap-1 items-center">
                    <User
                      as="button"
                      name={log.userName}
                      className="capitalize"
                    />{" "}
                    <div className="text-[10px] text-gray-500">
                      {formatCustomDate(log.createdAt)}
                    </div>
                  </div>
                  <p className="ml-[48px] text-[12px] pb-2.5">
                    {log.actionType === "add" ? "added" : log.actionType}{" "}
                    <span className="font-semibold uppercase">
                      {log.resourceName}
                    </span>{" "}
                    {log.actionType === "add" ? "to" : "from"} this deal
                  </p>

                  {dealLogs.length - 1 > i && (
                    <hr className=" border-[#575757]" />
                  )}
                </div>
              );
            })}
          </>
        )}
      </div>
    </div>
  );
}

export default AllDealComments;
