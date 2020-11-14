import 'react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Editor from '../dist/index';

const App = () => {
  return (
    <div>
      <Editor id="10" modelsInfo={[]} />
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
