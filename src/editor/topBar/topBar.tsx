import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  useEditor,
  useModels,
  useModelIndex,
  useMonaco,
  modelsInfoType,
} from '../editorContext';
import PlayButton from './rightButtons';
import Tab from './tab';
import NewFileButton from './plusNewFile/plusNewFile';
import { addNewModel } from '../mountFunctions';

const useStyles = makeStyles({
  bar: {
    display: 'flex',
    flexDirection: 'row',
    flexGrow: 1,
    height: '33px',
    backgroundColor: '#2d3233',
    width: '100%',
    alignItems: 'center',
  },
});

type TopBarProps = {
  editorId: string;
  modelsInfo: modelsInfoType;
};

export type PlusModelFunc = (
  filename: string,
  language: 'javascript' | 'typescript' | 'json'
) => void;

export default function TopBar({ editorId, modelsInfo }: TopBarProps) {
  const classes = useStyles();
  const [models, setModels] = useModels();
  const [ctxEditor, setCtxEditor] = useEditor();
  const [selectedIdx, setSelectedIdx] = useModelIndex();
  const [monaco, setMonaco] = useMonaco();

  //curry function adding from mount
  const plusModel = (
    filename: string,
    language: 'javascript' | 'typescript' | 'json'
  ) =>
    addNewModel(
      {
        value: '',
        filename,
        language,
      },
      models!.length,
      monaco!,
      ctxEditor!,
      setModels,
      setSelectedIdx
    );

  function dragTabMove(draggedIdx: number, draggedToIdx: number) {
    if (models) {
      let newModels = [...models];
      //drag left
      if (draggedIdx > draggedToIdx) {
        newModels.splice(draggedToIdx, 0, models[draggedIdx]);
        newModels.splice(draggedIdx + 1, 1);
      } else {
        //drag right
        newModels.splice(draggedToIdx + 1, 0, models[draggedIdx]);
        newModels.splice(draggedIdx, 1);
      }
      setModels(newModels);
      setSelectedIdx(draggedToIdx);
    }
  }

  function deleteTab(index: number) {
    if (models && models.length > 1) {
      let newModels = [...models];
      newModels.splice(index, 1);
      setModels(newModels);
      if (index < newModels.length) {
        setSelectedIdx(index);
        ctxEditor?.setModel(newModels[index].model);
      } else {
        setSelectedIdx(index-1);
        ctxEditor?.setModel(newModels[index - 1].model);
      }
    } else {
      console.error("Cannot delete only model", editorId)
    }
  }
  //if model is readonly make editor readonly
  //Since this code could go anywhere should I extract a custom hook?
  useEffect(() => {
    if (ctxEditor && models && selectedIdx !== undefined) {
      ctxEditor.updateOptions({ readOnly: models[selectedIdx].readOnly });
    }
  }, [selectedIdx, ctxEditor, selectedIdx]);

  return (
    <div className={classes.bar}>
      {models &&
        models
          .filter(model => !model.shown)
          .map((model, index) => (
            <Tab
              key={index}
              model={model}
              index={index}
              dragTabMove={dragTabMove}
              deleteTab={deleteTab}
            />
          ))}
      <NewFileButton plusModel={plusModel} />
      <PlayButton modelsInfo={modelsInfo} editorId={editorId} />
    </div>
  );
}
