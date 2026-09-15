import React from "react";
import Preview from "./Preview";

const Display = ({ links, themeImage, themeName, textColor, boxColor, onLinkViewed }) => {
  return (
    <div>
      {/* <img className='-mt-10 sticky top-40'
       src="https://png.pngtree.com/png-clipart/20240312/original/pngtree-3d-phone-mockup-object-png-image_14571225.png" alt="" /> */}
      <Preview
        links={links}
        themeImage={themeImage}
        themeName={themeName}
        textColor={textColor}
        boxColor={boxColor}
        onLinkViewed={onLinkViewed}
      />
    </div>
  );
};

export default Display;
