import React from 'react';
import { Button, Input, Space, Typography, message } from 'antd';

const { Title } = Typography;

const worker = new SharedWorker(new URL('./worker.ts', import.meta.url), { type: 'module' });
worker.port.onmessage = (e) => {
  message.success(`Received: ${e.data}`);
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
            worker.port.postMessage(m);
            message.info(`Sent: ${m}`);
          }}
        >
          Send to shared worker
        </Button>
      </Space>
    </>
  );
};

export default App;
