"use client";

import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  useDisclosure,
} from "@nextui-org/react";
import dynamic from "next/dynamic";

import { FaExternalLinkAlt } from "react-icons/fa";
import { FaCheck, FaGear, FaXmark } from "react-icons/fa6";

const DynamicAddTeamMemberModel = dynamic(
  () => import("./AddTeamMemberModel"),
  {
    ssr: false,
  }
);

const TeamSetup = ({ user }) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  return (
    <div className="mt-3 border-t border-gray-600">
      <Table
        shadow="none"
        aria-label="Example static collection table"
        classNames={{
          wrapper: "pt-5 px-0 rounded-none",
          thead: "rounded-none",
          th: "!rounded-none",
          td: "!rounded-none",
          tr: "!rounded-none",
        }}
      >
        <TableHeader>
          <TableColumn>Active</TableColumn>
          <TableColumn>Name</TableColumn>
          <TableColumn>Role</TableColumn>
          <TableColumn></TableColumn>
        </TableHeader>
        <TableBody>
          <TableRow key="1">
            <TableCell>
              {user?.isTeamMember ? <FaXmark /> : <FaCheck />}
            </TableCell>
            <TableCell className="capitalize">
              {user?.memberName || user?.ownerName}
            </TableCell>
            <TableCell className="capitalize">
              {user?.isTeamMember ? "member" : "owner"}
            </TableCell>
            <TableCell className="flex items-center text-lg">
              <a
                href={`https://docs.google.com/spreadsheets/d/${user?.googleSheetId}/edit`}
                target="_blank"
                title="Open Google Sheet"
              >
                <FaExternalLinkAlt />
              </a>

              {/* Trigger the add team member model */}
              {!user?.isTeamMember ? (
                <Button
                  onPress={onOpen}
                  className=" bg-transparent min-w-[10px] text-xl"
                  radius="none"
                  title="Manage Team"
                >
                  <FaGear />
                </Button>
              ) : null}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
      <DynamicAddTeamMemberModel
        onOpen={onOpen}
        onOpenChange={onOpenChange}
        isOpen={isOpen}
        user={user}
      />
    </div>
  );
};

export default TeamSetup;
