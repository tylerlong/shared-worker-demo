import React from 'react';
import { Button, Input, Space, Typography } from 'antd';

const { Title } = Typography;

const worker = new SharedWorker(new URL('./worker.ts', import.meta.url), { type: 'module' });
worker.port.onmessage = (e) => {
  console.log(e.data);
};

const App = () => {
  const [m, setM] = React.useState<string>('Hello world!');
  return (
    <>
      <Title>Untitled App</Title>
      <Space>
        <Input defaultValue={m} onChange={(v) => setM(v.target.value)} />
        <Button
          onClick={() => {
            worker.port.postMessage({ type: 'subscribe' });
          }}
        >
          Subscribe
        </Button>
        <Button
          onClick={() => {
            worker.port.postMessage({ type: 'unsubscribe' });
          }}
        >
          Unsubscribe
        </Button>
        <Button
          onClick={() => {
            worker.port.postMessage({ type: 'trigger' });
          }}
        >
          Trigger a notification
        </Button>
      </Space>
    </>
  );
};

export default App;
