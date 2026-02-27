import GooeyNav from "../../GooeyNav.jsx";
import { gooeyProps } from "./config";

const DesktopGooeyNav = () => {
  return (
    <div className=" hidden min-w-0 flex-1 sm:block md:flex-none md:overflow-visible">
      <GooeyNav {...gooeyProps} />
    </div>
  );
};

export default DesktopGooeyNav;
