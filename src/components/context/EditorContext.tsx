import React, { createContext, useState } from "react";

interface EditorContextProps {
    children: React.ReactNode;
}

interface EditorContextTypes {
    editorLoading: boolean;
    setEditorLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const EditorContextDefaultValues: EditorContextTypes = {
    editorLoading: false,
    setEditorLoading: () => {},
};

export const EditorLoadingContext = createContext<EditorContextTypes>(
    EditorContextDefaultValues,
);

const EditorContext: React.FC<EditorContextProps> = ({ children }) => {
    const [editorLoading, setEditorLoading] = useState<boolean>(false);

    return (
        <EditorLoadingContext.Provider
            value={{ editorLoading, setEditorLoading }}
        >
            {children}
        </EditorLoadingContext.Provider>
    );
};

export default EditorContext;
