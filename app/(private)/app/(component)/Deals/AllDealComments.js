"use client";

import { formatCustomDate } from "@/utils/formatCustomDate";
import { User } from "@nextui-org/react";
import { useEffect, useState } from "react";
import CommentSkeleton from "./CommentSkeleton";

function AllDealComments({ dealId, newCommentState }) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchComments() {
      try {
        const response = await fetch(`/api/comments?dealId=${dealId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch comments");
        }
        const data = await response.json();
        setComments(data);
      } catch (error) {
        console.log("Error:", error);
        setLoading(false);
      } finally {
        setLoading(false);
      }
    }

    fetchComments();
  }, [dealId, newCommentState]);

  return (
    <div>
      {/* Deal comments */}
      <div className=" text-color02">
        <div>Comments:</div>

        {loading && <CommentSkeleton />}

        {comments.length > 0 ? (
          comments.map((comment) => {
            const emailName = comment?.userId?.email.split("@")[0];
            return (
              <div key={comment._id} className="mt-5 ">
                <div className="flex items-center gap-1">
                  <User as="button" name={emailName} className="capitalize" /> :
                  <div className="text-sm text-gray-500">
                    {formatCustomDate(comment.createdAt)}
                  </div>
                </div>
                <div className="mt-1 ml-[48px] text-[13px]">
                  {comment.comment}
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-sm text-color03">No Comments</div>
        )}
      </div>
    </div>
  );
}

export default AllDealComments;
