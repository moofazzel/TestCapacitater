import { ResizableBox } from "react-resizable";
import "react-resizable/css/styles.css";

const ResizableTimeline = ({ children }) => {
  return (
    <ResizableBox
      width={Infinity} // Full width, allowing only vertical resizing
      height={300} // Default height
      minConstraints={[Infinity, 150]} // Min height, no width constraint
      maxConstraints={[Infinity, 800]} // Max height, no width constraint
      resizeHandles={["s"]} // Bottom handle for vertical resizing
    >
      <div style={{ overflow: "auto", height: "100%", width: "100%" }}>
        {children}
      </div>
    </ResizableBox>
  );
};

export default ResizableTimeline;
