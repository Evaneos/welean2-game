var mobileEventManager = {
  socket: null,

  connect(url) {
    this.socket = io.connect(url);
  },

  emit(eventName, data) {
    this.socket.emit(eventName, data);
  }
};