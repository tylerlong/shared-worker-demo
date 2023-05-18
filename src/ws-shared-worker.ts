import RingCentral from '@rc-ex/core';
import WSExtension from '@rc-ex/ws';

class WSSharedWorker {
  public static subscribe(worker: SharedWorker, eventFilters: string[], subscriptionName = 'default') {
    worker.port.postMessage({ type: 'subscribe', eventFilters, subscriptionName });
  }

  public static unsubscribe(worker: SharedWorker, subscriptionName = 'default') {
    worker.port.postMessage({ type: 'unsubscribe', subscriptionName });
  }

  public rc: RingCentral;

  public listeners: { [subscriptionName: string]: any } = {};
  public cache = new Set<any>();

  public constructor(rc: RingCentral) {
    this.rc = rc;
  }

  public init(event: any) {
    const port = event.ports[0];
    port.onmessage = async (e: any) => {
      switch (e.data.type) {
        case 'subscribe': {
          const { eventFilters, subscriptionName } = e.data;
          if (!this.listeners[subscriptionName]) {
            this.listeners[subscriptionName] = new Set();
            const wsExt = new WSExtension();
            await this.rc.installExtension(wsExt);
            await wsExt.subscribe(eventFilters, (event) => {
              for (const port of Array.from<any>(this.listeners[subscriptionName])) {
                port.postMessage(event);
              }
            });
            this.cache.add(wsExt);
          }
          this.listeners[subscriptionName].add(port);
          break;
        }
        case 'unsubscribe': {
          this.listeners[e.data.subscriptionName].delete(port);
          break;
        }
        default: {
          break;
        }
      }
    };
  }
}

export default WSSharedWorker;
