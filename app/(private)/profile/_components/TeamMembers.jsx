"use client";
import { Tooltip, User } from "@nextui-org/react";
import { useEffect, useState } from "react";
import DeleteTeamMemberModel from "./DeleteTeamMemberModel";
import TeamMembersSkeleton from "./TeamMembersSkeleton";

const TeamMembers = ({ teamMembers, setTeamMembers }) => {
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
  }, []);
  return (
    <div>
      <p className="flex items-center gap-1 my-4">
        Project Members
        <span className="flex items-center justify-center text-sm text-center bg-gray-200 rounded-full size-5">
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
          {teamMembers?.map((member, i) => {
            const memberAvatar = member?.image || null;
            return (
              <div key={i} className="flex flex-col items-start gap-3">
                <div className="relative flex items-center justify-between w-full gap-3">
                  <User
                    avatarProps={{
                      src: memberAvatar,
                    }}
                    description={member.email}
                    name={member?.name}
                  />
                  {!member.joined && (
                    <span className="text-sm text-red-500">Not Joined</span>
                  )}
                  <Tooltip color="danger" content="Delete Member">
                    <div className="text-lg cursor-pointer text-danger active:opacity-50">
                      <DeleteTeamMemberModel
                        memberEmail={member.email}
                        setTeamMembers={setTeamMembers}
                      />
                    </div>
                  </Tooltip>
                </div>
              </div>
            );
          })}
        </>
      )}
    </div>
  );
};

export default TeamMembers;
