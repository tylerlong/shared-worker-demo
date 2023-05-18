import React from 'react';
import { Button, Space, Typography } from 'antd';
import RingCentral from '@rc-ex/core';

import WSSharedWorker from './ws-shared-worker';

const rc = new RingCentral({
  server: process.env.RINGCENTRAL_SERVER_URL,
  clientId: process.env.RINGCENTRAL_CLIENT_ID,
  clientSecret: process.env.RINGCENTRAL_CLIENT_SECRET,
});
rc.authorize({
  jwt: process.env.RINGCENTRAL_JWT_TOKEN,
});

const { Title } = Typography;

const worker = new SharedWorker(new URL('./worker.ts', import.meta.url), { type: 'module' });
worker.port.onmessage = (e) => {
  console.log(e.data);
};

const App = () => {
  return (
    <>
      <Title>RingCentral Shared Worker Demo</Title>
      <Space>
        <Button
          onClick={() => {
            WSSharedWorker.subscribe(worker, ['/restapi/v1.0/account/~/extension/~/message-store?type=Pager']);
            console.log('Subscribed');
          }}
        >
          Subscribe
        </Button>
        <Button
          onClick={() => {
            WSSharedWorker.unsubscribe(worker);
            console.log('Unsubscribed');
          }}
        >
          Unsubscribe
        </Button>
        <Button
          onClick={() => {
            rc.restapi()
              .account()
              .extension()
              .companyPager()
              .post({
                from: { extensionId: rc.token.owner_id },
                to: [{ extensionId: rc.token.owner_id }],
                text: 'Hello world',
              });
            console.log('Triggered');
          }}
        >
          Trigger a notification
        </Button>
      </Space>
    </>
  );
};

export default App;
