module.exports = function() {
    var timeoutId;
    this.$elt = $('<div class="popup">').appendTo('body');
    this.display = function(message, persistant) {
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
        this.$elt.text(message).css('opacity', 1).show();
        if (!persistant) {
            timeoutId = setTimeout(this.close.bind(this), 1000);
        }
    };
    this.close = function() {
        this.$elt.css('opacity', 0).delay(500).hide();
    };
};