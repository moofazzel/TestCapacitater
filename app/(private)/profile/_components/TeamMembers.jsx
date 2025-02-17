"use client";
import { Tooltip, User } from "@nextui-org/react";
import { useEffect, useState } from "react";
import DeleteTeamMemberModel from "./DeleteTeamMemberModel";
import TeamMembersSkeleton from "./TeamMembersSkeleton";

const TeamMembers = ({ teamMembers, setTeamMembers, user }) => {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    // call the API to get the team members
    const fetchTeamMembers = async () => {
      try {
        const response = await fetch("/api/team");
        const data = await response.json();
        setTeamMembers(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching team members:", error);
        setLoading(false);
      }
    };

    fetchTeamMembers();
  }, [setTeamMembers]);

  return (
    <div>
      <p className="flex gap-1 items-center mb-4">
        Project Members
        <span className="flex justify-center items-center text-sm text-center bg-gray-200 rounded-full size-5">
          {teamMembers.length || 0}
        </span>
      </p>

      {/* Show loading */}
      {loading ? (
        <>
          {[...Array(2)].map((_, i) => (
            <TeamMembersSkeleton key={i} />
          ))}
        </>
      ) : (
        <>
          {teamMembers.length === 0 && <div> No team member found </div>}
          {user?.ownerName && (
            <div className="flex relative justify-between items-center mt-3 w-full">
              <div className="flex gap-3 items-center">
                <User
                  avatarProps={{
                    src: user?.ownerImage,
                  }}
                  description={user?.ownerEmail}
                  name={user?.ownerName}
                />
              </div>
            </div>
          )}
          {teamMembers?.map((member, i) => {
            const memberAvatar = member?.image || null;
            return (
              <div
                key={i}
                className="flex relative justify-between items-center mt-3 w-full"
              >
                <div className="flex gap-3 items-center">
                  <User
                    avatarProps={{
                      src: memberAvatar,
                    }}
                    description={member.email}
                    name={member?.name}
                  />
                  {!member.joined && (
                    <small className="text-[10px] text-red-500">
                      (Not Joined)
                    </small>
                  )}
                </div>
                {!user?.isTeamMember && (
                  <Tooltip color="danger" content="Delete Member">
                    <DeleteTeamMemberModel
                      memberEmail={member.email}
                      setTeamMembers={setTeamMembers}
                    />
                  </Tooltip>
                )}
              </div>
            );
          })}
        </>
      )}
    </div>
  );
};

export default TeamMembers;
