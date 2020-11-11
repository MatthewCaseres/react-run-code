import monacoForType, { editor } from 'monaco-editor';
import { modelsType, modelInfoType } from './editorContext';

//When content size changes editor height matches
function setDynamicHeight(
  editor: editor.IStandaloneCodeEditor,
  setHeightCallback: React.Dispatch<React.SetStateAction<number>>
) {
  editor.onDidContentSizeChange(() => {
    setHeightCallback(Math.min(1000, editor.getContentHeight()));
    editor.layout();
  });
  editor.onDidChangeModel(() => {
    setHeightCallback(Math.min(1000, editor.getContentHeight()));
    editor.layout();
  });
}

function setTheme(monaco: typeof monacoForType) {
  monaco.editor.defineTheme('myCustomTheme', {
    base: 'vs-dark',
    inherit: true,
    colors: {},
    rules: [],
  });
  monaco.editor.setTheme('myCustomTheme');
}

function registerFileCompletion(
  monaco: typeof monacoForType,
  modelInfo: modelInfoType
) {
  monaco.languages.registerCompletionItemProvider(modelInfo.language, {
    triggerCharacters: ["'", '"'],
    provideCompletionItems: function(model, position) {
      // find out if we are completing a property in the 'dependencies' object.
      var textUntilPosition = model.getValueInRange({
        startLineNumber: 1,
        startColumn: 1,
        endLineNumber: position.lineNumber,
        endColumn: position.column,
      });
      var match = textUntilPosition.match(/from\s+/);
      if (!match) {
        return { suggestions: [] };
      }
      var word = model.getWordUntilPosition(position);
      var range = {
        startLineNumber: position.lineNumber,
        endLineNumber: position.lineNumber,
        startColumn: word.startColumn,
        endColumn: word.endColumn,
      };
      return {
        suggestions: [
          {
            label: modelInfo.filename.replace(/\.[^.]*$/, ''),
            kind: monaco.languages.CompletionItemKind.Function,
            documentation: 'The Lodash library exported as Node.js modules.',
            insertText: modelInfo.filename.replace(/\.[^.]*$/, ''),
            range: range,
          },
        ],
      };
    },
  });
}

export function addNewModel(
  modelInfo: modelInfoType,
  modelIndex: number,
  monaco: typeof monacoForType,
  editor: editor.IStandaloneCodeEditor,
  setModels: React.Dispatch<React.SetStateAction<modelsType | undefined>>,
  setSelectedIdx: React.Dispatch<React.SetStateAction<number | undefined>>,
  overWriteExisting = false
) {
  let model = monaco.editor.getModel(monaco.Uri.file(modelInfo.filename));
  //If model not exist create, otherwise replace value (for editor resets).
  if (model === null) {
    model = monaco.editor.createModel(
      modelInfo.value,
      modelInfo.language,
      monaco.Uri.file(modelInfo.filename)
    );
    //Provide autocompletion for created files
    registerFileCompletion(monaco, modelInfo);
  } else if (overWriteExisting) {
    model.setValue(modelInfo.value);
  }
  model.updateOptions({ tabSize: 2 });

  //undefined initially so ternary operator deals with edge case, useContext typing issue
  setModels(
    models =>
      [
        ...models!,
        {
          ...modelInfo,
          model,
        },
      ] as modelsType
  );
  //The last model with initial true should be initial
  if (!modelInfo.notInitial) {
    editor.setModel(model);
    setSelectedIdx(modelIndex);
  }
}

function setModelsFromInfo(
  modelsInfo: modelInfoType[],
  monaco: typeof monacoForType,
  editor: editor.IStandaloneCodeEditor,
  setModels: React.Dispatch<React.SetStateAction<modelsType | undefined>>,
  setSelectedIdx: React.Dispatch<React.SetStateAction<number | undefined>>,
  overWriteExisting = false
) {
  setModels([]);
  modelsInfo.map((modelInfo, modelIndex) => {
    addNewModel(
      modelInfo,
      modelIndex,
      monaco,
      editor,
      setModels,
      setSelectedIdx,
      overWriteExisting
    );
  });
}

function setRunnerModel(monaco: typeof monacoForType) {
  let runnerModel: editor.ITextModel;
  if (!monaco.editor.getModels().some(model => model.uri.path === '/0.ts')) {
    runnerModel = monaco.editor.createModel(
      '',
      'typescript',
      monaco.Uri.file('0.ts')
    );
  } else {
    runnerModel = monaco.editor.getModel(monaco.Uri.file('0.ts'))!;
  }
  // Only use this when testing/debugging
  // setModels(
  //   (models) =>
  //     [
  //       ...models!,
  //       {
  //         isShown: true,
  //         isInitial: false,
  //         isReadOnly: false,
  //         filename: "0.ts",
  //         value: "",
  //         language: "typescript",
  //         model: runnerModel as editor.ITextModel,
  //       },
  //     ] as modelsType
  // );
}

export { setDynamicHeight, setTheme, setModelsFromInfo, setRunnerModel };
