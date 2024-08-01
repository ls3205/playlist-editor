import React from "react";
import { ResizablePanel } from "./ui/Resizable";

interface SearchProps {}

const Search: React.FC<SearchProps> = ({}) => {
    return (
        <ResizablePanel
            defaultSize={33}
            className="w-full rounded-md bg-secondary"
        ></ResizablePanel>
    );
};

export default Search;
