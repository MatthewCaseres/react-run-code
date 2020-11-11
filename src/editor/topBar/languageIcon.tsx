import React from 'react';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles({
  JS: {
    height: '100%',
    marginRight: '5px',
    color: '#cbcb41',
    fontSize: '0.7em',
    fontWeight: 700,
  },
  TS: {
    height: '100%',
    marginRight: '5px',
    color: '#5098b7',
    fontSize: '0.7em',
    fontWeight: 700,
  },
  JSON: {
    height: '100%',
    marginRight: '5px',
    color: '#c7c741',
    fontSize: '0.8em',
    fontWeight: 700,
  },
});

export default function LanguageIcon({
  language,
}: {
  language: 'typescript' | 'javascript' | 'json';
}) {
  const classes = useStyles();
  if (language === 'javascript') {
    return <span className={classes.JS}>JS</span>;
  } else if (language === 'typescript') {
    return <span className={classes.TS}>TS</span>;
  } else {
    return <span className={classes.JSON}>{`{ }`}</span>;
  }
}
