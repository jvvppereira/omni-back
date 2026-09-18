const clients = new Set();

function addClient(res) {
  clients.add(res);
}

function removeClient(res) {
  clients.delete(res);
}

function broadcast(event, data) {
  const payload = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
  clients.forEach((client) => {
    try {
      client.write(payload);
    } catch (err) {
      clients.delete(client);
    }
  });
}

function getClientCount() {
  return clients.size;
}

module.exports = { addClient, removeClient, broadcast, getClientCount };