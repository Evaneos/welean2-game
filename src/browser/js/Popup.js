module.exports = function() {
    var timeoutId;
    this.$elt = $('<div class="popup">').appendTo('body');
    this.display = function(message) {
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
        this.$elt.text(message).css('opacity', 1).show();
        timeoutId = setTimeout(() => {
            this.$elt.css('opacity', 0).delay(500).hide();
        }, 1000);
    };
};