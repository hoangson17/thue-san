import React from "react";
import ListCourt from "../../components/ListCourt";
import { Carosel } from "@/components";

const HomePage = () => {
  return (
    <div>
      <div>
        <Carosel />
      </div>
      <ListCourt />
    </div>
  );
};

export default HomePage;
