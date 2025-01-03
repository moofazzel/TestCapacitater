const DoneIcon = ({ onClick }) => {
  return (
    <>
      <svg
        onClick={onClick}
        className="hover:cursor-pointer"
        stroke="currentColor"
        fill="currentColor"
        strokeWidth="0"
        width="38"
        height="38"
        viewBox="0 0 38 38"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path fill="none" d="M0 0h24v24H0z"></path>
        <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"></path>
      </svg>
    </>
  );
};

export default DoneIcon;
