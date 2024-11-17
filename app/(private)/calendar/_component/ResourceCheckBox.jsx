import { Checkbox, cn, Input, Link, User } from "@nextui-org/react";

export const ResourceCheckBox = ({ user, statusColor, value }) => {
  return (
    <div className={``}>
      <Checkbox
        aria-label={user.name}
        classNames={{
          base: cn(
            "inline-flex max-w-md w-full bg-content1 m-0",
            "hover:bg-content2 items-center justify-start",
            "cursor-pointer rounded-lg gap-2 p-4 border-2 border-transparent",
            "data-[selected=true]:border-primary"
          ),
          label: "w-full",
        }}
        value={value}
      >
        <div className="w-full flex justify-between gap-2">
          <User
            avatarProps={{ size: "md", src: user.avatar }}
            description={
              <Link isExternal href={user.url} size="sm">
                {user.role}
              </Link>
            }
            name={user.name}
          />
        </div>
      </Checkbox>
      <Input type="number" />
    </div>
  );
};
