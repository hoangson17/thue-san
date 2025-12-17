import React from "react";
import { Carosel, HomeIntro, Partner } from "@/components";

const HomePage = () => {
  return (
    <div>
      <div>
        <Carosel />
      </div>
      <HomeIntro />
      <Partner />
    </div>
  );
};

export default HomePage;
