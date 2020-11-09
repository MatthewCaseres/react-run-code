import { modelsType } from '../editorContext';
import monacoForType, { editor } from 'monaco-editor';
import getModelsInOrder from './getModelsInOrder';

function getErrors(
  monacoInstance: typeof monacoForType,
  orderedModels: editor.ITextModel[]
) {
  const ranPaths = orderedModels.map(textModel => textModel.uri.path);
  const ranModelMarkers = monacoInstance.editor
    .getModelMarkers({})
    .filter(markers => ranPaths.includes(markers.resource.path));
  const messages = ranModelMarkers
    .filter(marker => marker.severity === 8)
    .map(model => `${model.resource.path.substr(1)}: ${model.message}`);
  return messages;
}

export default async function runFile(
  editorId: string,
  monacoInstance: typeof monacoForType | undefined,
  models: modelsType | undefined,
  selectedIdx: number | undefined,
  setConsoleMessages: Function
) {
  setConsoleMessages([]);
  if (monacoInstance && models && selectedIdx !== undefined) {
    //runnerModel should (!) exist
    const runnerModel = monacoInstance.editor
      .getModels()
      .find(model => model.uri.toString() === 'file:///0.ts')!;

    const ranModels = getModelsInOrder(models[selectedIdx], monacoInstance); //dfs on imports
    ranModels.map(model => model.uri.path);
    //If type errors log and don't run files.
    const errors = getErrors(monacoInstance, ranModels);
    errors.map(error => console.error(error, editorId));
    //Concat files left to right
    if (!errors.length) {
      const lines =
        ranModels
          .map(model => model.getLinesContent()) //text array for each model
          .reduce((prevModels, model) => prevModels.concat(model)) //flatten
          .filter(line => !line.includes('import') && !line.includes('export')) //no imports and exports, expect separate line for declarations
          .map(line => line + '\n')
          .reduce((prevLines, line) => prevLines + line) + 'export {}'; //Prevents duplicate identifiers by making module;
      //Set runner model value as concatted text
      runnerModel.setValue(lines);

      const tsClient = await monacoInstance.languages.typescript
        .getTypeScriptWorker()
        .then(worker => worker(runnerModel.uri));
      const emittedJS = (
        await tsClient.getEmitOutput(runnerModel.uri.toString())
      ).outputFiles[0].text;
      let consoleOverride = `let console = (function (oldCons) {
        return {
          ...oldCons,
          log: function (...args) {
            oldCons.log.apply("lol")
            args.push("${editorId}");
            oldCons.log.apply(oldCons, args);
          },
          warn: function (...args) {
            args.push("${editorId}");
            oldCons.warn.apply(oldCons, args);
          },
          error: function (...args) {
            args.push("${editorId}");
            oldCons.error.apply(oldCons, args);
          },
        };
      })(window.console);`;
      try {
        Function(consoleOverride + emittedJS)();
      } catch (e) {
        //This is to format runtime errors
        if (e.stack) {
          let message: string = e.stack;
          const index = message.indexOf('\n');
          index === -1 ? undefined : index;
          message = message.substring(0, index);
          console.error(message, editorId);
        } else {
          console.error(e, editorId);
        }
      }
    }
  }
}

//Run every test file (currently only support 1 tested file)
export async function runTestFile(
  editorId: string,
  monacoInstance: typeof monacoForType | undefined,
  models: modelsType | undefined,
  setConsoleMessages: Function
) {
  let testModelIndex = models?.findIndex(model => model.tested);
  if (typeof testModelIndex !== 'undefined' && testModelIndex !== -1) {
    await runFile(
      editorId,
      monacoInstance,
      models,
      testModelIndex,
      setConsoleMessages
    );
  }
}
