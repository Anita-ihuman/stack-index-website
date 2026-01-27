import React from "react";

export const SubstackEmbed = () => {
  return (
    // let the embed fill the column so it matches the Past Issues column size
    <div className="w-full rounded-md overflow-hidden mx-auto h-full">
      <div className="w-full h-full">
        <iframe
          title="Anita Ihuman — Newsletter (Substack)"
          src="https://anitaihuman.substack.com/embed"
          style={{ border: 0, background: "transparent" }}
          frameBorder="0"
          scrolling="no"
          className="w-full h-full min-h-[220px]"
        />
      </div>
    </div>
  );
};

export default SubstackEmbed;
