import React from 'react';
import { Meta, Story } from '@storybook/react';
import Editor, {editorProps} from '../src/editor/Editor';

const meta: Meta = {
  title: 'Editor',
  component: Editor,
};

export default meta;

const Template: Story<editorProps> = args => (
  <Editor
    {...args}
  />
);

// By passing using the Args format for exported stories, you can control the props for a component for reuse in a test
// https://storybook.js.org/docs/react/workflows/unit-testing
export const MultiFile = Template.bind({});

MultiFile.args = {
  id: '3',
  modelsInfo: [
    {
      filename: 'exports.js',
      value: 'let a = 2\r\nexport {a}',
      language: 'javascript',
    },
    {
      filename: 'imports.js',
      value: 'import {a} from "exports"\r\nconsole.log(a)',
      language: 'javascript',
    },
  ],
};

export const MultiLanguage = Template.bind({});

MultiLanguage.args = {
  id: '1',
  modelsInfo: [
    {
      filename: 'JavaScript.js',
      value: 'console.log("I\'m a JavaScript file")',
      language: 'javascript',
    },
    {
      value:
        '(function (greet: string) {\r\n  console.log(greet)\r\n})("howdy")',
      filename: 'TypeScript.ts',
      language: 'typescript',
    },
  ],
};

export const ReadOnly = Template.bind({});

ReadOnly.args = {
  id: '2',
  modelsInfo: [
    {
      readOnly: true,
      filename: 'ReadOnly.js',
      value: 'console.log("Read only")',
      language: 'javascript',
    },
  ],
};



