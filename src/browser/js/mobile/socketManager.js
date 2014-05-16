var mobileEventManager = {
  socket: null,

  connect: function(url) {
    this.socket = io.connect(url);
  },

  emit: function(eventName, data) {
    this.socket.emit(eventName, data);
  }
};