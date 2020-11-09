import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import useOnclickOutside from 'react-cool-onclickoutside';
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';
import { PlusModelFunc } from '../topBar';
import { useState } from 'react';

const useStyles = makeStyles({
  dropdown: {
    position: 'relative',
    display: 'inline-block',
  },

  dropdownContent: {
    display: 'flex',
    position: 'absolute',
    backgroundColor: '#252526',
    border: '1px solid #007fd4',
    minWidth: '160px',
    zIndex: 1,
    margin: '3px',
  },

  dropdownInput: {
    border: 0,
    color: '#b0b0b0',
    backgroundColor: '#2d3233',
    outline: 'none !important',
  },

  dropdownSelect: {
    border: '0px',
    borderLeft: '1px solid #007fd4',
    color: '#b0b0b0',
    backgroundColor: '#2d3233',
    outline: 'none !important',
  },
});

type newFileButtonProps = { plusModel: PlusModelFunc };
export default function NewFileButton({ plusModel }: newFileButtonProps) {
  const classes = useStyles();
  const [openMenu, setOpenMenu] = useState(false);
  const [input, setInput] = useState('');
  const [fileType, setFileType] = useState('typescript');
  const ref = useOnclickOutside(() => {
    setOpenMenu(false);
  });

  const createModelOnEnter = () => {
    let extension = fileType === 'typescript' ? '.ts' : '.js';
    plusModel(
      input + extension,
      fileType as 'typescript' | 'javascript' | 'json'
    );
  };
  return (
    <div className={classes.dropdown} ref={ref}>
      <IconButton size="small" onClick={() => setOpenMenu(true)}>
        <AddIcon style={{ color: '#787777' }}></AddIcon>
      </IconButton>
      {openMenu && (
        <div className={classes.dropdownContent}>
          <input
            className={classes.dropdownInput}
            autoFocus
            placeholder="type file name, press enter"
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter') {
                createModelOnEnter();
                setOpenMenu(false);
              }
            }}
          ></input>
          <select
            className={classes.dropdownSelect}
            onChange={e => setFileType(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter') {
                createModelOnEnter();
                setOpenMenu(false);
              }
            }}
          >
            <option value="typescript">.ts</option>
            <option value="javascript">.js</option>
          </select>
        </div>
      )}
    </div>
  );
}
