import React, { useEffect, Dispatch, SetStateAction } from 'react';
import { Console, Hook, Unhook } from 'console-feed';
import { useConsoleMessages } from './editorContext';

const LogsContainer = ({
  editorId,
  onSuccess,
  onFailure,
}: {
  editorId: string;
  onSuccess?: Dispatch<SetStateAction<number>>;
  onFailure?: Function;
}) => {
  const [logs, setLogs] = useConsoleMessages();

  // run once!
  useEffect(() => {
    Hook(
      window.console,
      (log: any) => {
        if (log.data?.pop() === editorId) {
          // Problem completion determined by logs. How else?
          let lastItem = log.data?.slice(-1)[0];
          if (lastItem === 'Problem solved') {
            onSuccess?.(count => count + 1);
          }
          if (
            log.method === 'error' &&
            typeof lastItem === 'object' &&
            lastItem !== null &&
            'expected' in lastItem &&
            'returned' in lastItem
          ) {
            onFailure?.();
          }
          setLogs((logs: any) => [...logs, log]);
        }
      },
      false
    );
    return () => {
      Unhook(window.console as any);
    };
    //dependencies prevent stale
  }, [editorId, onFailure, onSuccess, setLogs]);

  return (
    <div className="log" style={{ backgroundColor: '#242424' }}>
      <Console
        logs={logs as any[]}
        styles={{ BASE_FONT_SIZE: 13 }}
        variant="dark"
      />
    </div>
  );
};

type logsType = typeof LogsContainer
export {logsType}
export default LogsContainer;
