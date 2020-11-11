import React from "react";
import monacoForTypes, { editor } from "monaco-editor";

export type modelInfoType = {
  notInitial?: boolean;
  shown?: boolean;
  readOnly?: boolean;
  tested?: boolean;
  filename: string;
  value: string;
  language: "typescript" | "javascript" | "json";
};

export type modelsInfoType = modelInfoType[];

export type modelType = modelInfoType & { model: editor.ITextModel };

export type modelsType = modelType[];

type EditorState = [
  editor.IStandaloneCodeEditor | undefined,
  React.Dispatch<React.SetStateAction<editor.IStandaloneCodeEditor | undefined>>
];
type MonacoState = [
  typeof monacoForTypes | undefined,
  React.Dispatch<React.SetStateAction<typeof monacoForTypes | undefined>>
];
type ModelsState = [
  modelsType | undefined,
  React.Dispatch<React.SetStateAction<modelsType | undefined>>
];
type modelIndexState = [
  number | undefined,
  React.Dispatch<React.SetStateAction<number | undefined>>
];
type ConsoleState = [any[], Function];

const EditorContext = React.createContext<EditorState | undefined>(undefined);
const MonacoContext = React.createContext<MonacoState | undefined>(undefined);
const ModelsContext = React.createContext<ModelsState | undefined>(undefined);
const ModelIndexContext = React.createContext<modelIndexState | undefined>(
  undefined
);
const ConsoleContext = React.createContext<ConsoleState>([[], () => {}]);

function EditorProvider({ children }: { children: React.ReactNode }) {
  const [editor, setEditor] = React.useState<
    editor.IStandaloneCodeEditor | undefined
  >();
  const [monaco, setMonaco] = React.useState<
    typeof monacoForTypes | undefined
  >();
  const [models, setModels] = React.useState<modelsType | undefined>();
  const [modelIndex, modelIndexState] = React.useState<number | undefined>();
  const [consoleMessages, setConsoleMessages] = React.useState([]);

  return (
    <MonacoContext.Provider value={[monaco, setMonaco]}>
      <EditorContext.Provider value={[editor, setEditor]}>
        <ModelsContext.Provider value={[models, setModels]}>
          <ModelIndexContext.Provider value={[modelIndex, modelIndexState]}>
            <ConsoleContext.Provider
              value={[consoleMessages, setConsoleMessages]}
            >
              {children}
            </ConsoleContext.Provider>
          </ModelIndexContext.Provider>
        </ModelsContext.Provider>
      </EditorContext.Provider>
    </MonacoContext.Provider>
  );
}
function useEditor() {
  const context = React.useContext(EditorContext);
  if (context === undefined) {
    throw new Error("useEditor must be used withing a provider");
  }
  return context;
}
function useMonaco() {
  const context = React.useContext(MonacoContext);
  if (context === undefined) {
    throw new Error("useEditor must be used withing a provider");
  }
  return context;
}
function useModelIndex() {
  const context = React.useContext(ModelIndexContext);
  if (context === undefined) {
    throw new Error("useEditor must be used withing a provider");
  }
  return context;
}
function useModels() {
  const context = React.useContext(ModelsContext);
  if (context === undefined) {
    throw new Error("useEditor must be used withing a provider");
  }
  return context;
}
function useConsoleMessages() {
  const context = React.useContext(ConsoleContext);
  if (context === undefined) {
    throw new Error("useEditor must be used withing a provider");
  }
  return context;
}

export {
  EditorProvider,
  useEditor,
  useMonaco,
  useModels,
  useModelIndex,
  useConsoleMessages,
};
