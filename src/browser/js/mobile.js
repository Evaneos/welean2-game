function playerReady() {
  mobileEventManager.connect('http://localhost');
}

socket.emit('user:new', {});