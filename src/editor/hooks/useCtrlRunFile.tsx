import {
  useMonaco,
  useModels,
  useModelIndex,
  useConsoleMessages,
} from '../editorContext';

import runFile from '../utils/runFile';

export default function useCtrlRunFile(id: string) {
  const [monacoInstance, setMonacoInstance] = useMonaco();
  const [selectedIdx, setSelectedIdx] = useModelIndex();
  const [models, setModels] = useModels();
  const [consoleMessages, setConsoleMessages] = useConsoleMessages();
  console.log(models);
  let runCtrlFile = () =>
    runFile(id, monacoInstance, models, selectedIdx, setConsoleMessages);
  return runCtrlFile;
}
