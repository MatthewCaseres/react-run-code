# React Run Code

![](https://github.com/Open-EdTech/react-run-code/blob/main/.github/intellisense.gif)

## Usage
This component builds itself. You can render an empty editor like this:
```typescript
import React from "react";
import Editor from "react-run-code";

function App() {
  return <Editor id="10" modelsInfo={[]} />;
}

export default App;
```
Then you can make new tabs and start filling in your code. Clicking on the green `<>` button copies the generated `modelsInfo` prop to your clipboard.

![](https://github.com/Open-EdTech/react-run-code/blob/main/.github/create-editor.gif)

You can now go into your source code and paste `[{"value":"console.log(\"make a new file\")","filename":"new.ts","language":"typescript"}]` in place of `[]` in the prop `modelsInfo={[]}`.

## Experimental

You can do import and export statements, but they just concatenate files on the basis of a topological sort. Open a file 0.ts if you want to see what is going on, that file is the one that gets transpiled to JavaScript and executed by your browser. The files are shared across the webpage. Here is an example of us importing "file1.ts" from "file2.ts" but getting an error because there is no real bundler.


![](https://github.com/Open-EdTech/react-run-code/blob/main/.github/duplicateError.gif)
