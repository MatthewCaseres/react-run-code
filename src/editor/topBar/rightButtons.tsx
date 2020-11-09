import React from "react"
import {
  useMonaco,
  useEditor,
  useModels,
  useModelIndex,
  modelsInfoType,
} from "../editorContext";
import runFile from "../utils/runFile";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import RestoreIcon from "@material-ui/icons/Restore";
import CodeIcon from "@material-ui/icons/Code";
import { useConsoleMessages } from "../editorContext";
import { setModelsFromInfo } from "../mountFunctions";

type PlayButtonType = { editorId: string; modelsInfo: modelsInfoType };
export default function PlayButton({ editorId, modelsInfo }: PlayButtonType) {
  const [selectedIdx, setSelectedIdx] = useModelIndex();
  const [consoleMessages, setConsoleMessages] = useConsoleMessages();
  const [monacoInstance, setMonacoInstance] = useMonaco();
  const [ctxEditor, setCtxEditor] = useEditor();
  const [models, setModels] = useModels();

  return (
    <div style={{ display: "flex", marginLeft: "auto", marginRight: "3px" }}>
      <CodeIcon
        onClick={() => {
          const newModelInfo = models?.map((mappedModel) => {
            const { model, ...theModelInfo } = mappedModel;
            theModelInfo.value = model.getValue();
            return theModelInfo;
          });
          navigator.clipboard.writeText(JSON.stringify(newModelInfo));
        }}
        style={{ color: "#09ad11", marginRight: "4px" }}
      />
      <RestoreIcon
        onClick={() =>
          setModelsFromInfo(
            modelsInfo,
            monacoInstance!,
            ctxEditor!,
            setModels,
            setSelectedIdx,
            true
          )
        }
        style={{ color: "#09ad11", marginRight: "4px" }}
      />
      <PlayArrowIcon
        onClick={() => {
          runFile(
            editorId,
            monacoInstance,
            models,
            selectedIdx,
            setConsoleMessages
          );
        }}
        style={{ color: "#09ad11" }}
      />
    </div>
  );
}
