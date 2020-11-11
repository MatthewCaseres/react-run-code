import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useEditor, useModelIndex } from '../editorContext';
import { modelType } from '../editorContext';
import LanguageIcon from './languageIcon';
import { useDrag, useDrop } from 'react-dnd';

const useStyles = makeStyles({
  tab: {
    display: 'inline-flex',
    height: '100%',
    cursor: 'pointer',
    alignItems: 'center',
    color: '#919191',
    padding: '0.3rem 0.4rem 0.3rem 0.6rem !important',
    fontSize: '0.75rem',
    fontWeight: 400,
    borderRight: '1px solid #252526',
    backgroundColor: '#2d3233',
    '&:hover': {
      '& span:last-child': {
        visibility: 'visible',
        fontSize: '0.9rem',
        marginLeft: '5px',
        color: 'gainsboro',
      },
    },
    '& span:last-child': {
      visibility: 'hidden',
      fontSize: '0.9rem',
      marginLeft: '5px',
      color: 'gainsboro',
    },
  },
});

type TabProps = {
  model: modelType;
  index: number;
  dragTabMove: (draggedIdx: number, draggedToIdx: number) => void;
  deleteTab: (index: number) => void;
};
type DragTabItem = {
  type: string;
  index: number;
};
export default function Tab({
  model,
  index,
  dragTabMove,
  deleteTab,
}: TabProps) {
  const classes = useStyles();
  const [selectedIdx, setSelectedIdx] = useModelIndex();
  const [ctxEditor, setCtxEditor] = useEditor();
  const [{ isDragging }, drag] = useDrag({
    item: { type: 'moveIdx', index },
    collect: monitor => ({
      isDragging: !!monitor.isDragging(),
    }),
  });
  const [{ isOver }, drop] = useDrop({
    accept: 'moveIdx',
    drop: (item: DragTabItem) => {
      dragTabMove(item.index, index);
    },
    collect: monitor => ({
      isOver: !!monitor.isOver(),
    }),
  });

  return (
    <span ref={drag}>
      <span
        onMouseDown={() => {
          setSelectedIdx(index);
          ctxEditor?.setModel(model.model);
        }}
        className={classes.tab}
        key={index}
        ref={drop}
        style={{
          backgroundColor:
            selectedIdx === index ? '#1D2021' : isOver ? '#4F4F4F' : '#2d3233',
        }}
      >
        <LanguageIcon language={model.language} />
        <span>{model.model.uri.path.substring(1)}</span>
        <span onClick={() => deleteTab(index)}>x</span>
      </span>
    </span>
  );
}
