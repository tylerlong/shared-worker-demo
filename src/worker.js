onconnect = function (event) {
  const port = event.ports[0];

  port.onmessage = function (e) {
    port.postMessage(e.data);
  };
};
