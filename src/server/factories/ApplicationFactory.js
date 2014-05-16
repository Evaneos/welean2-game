var ApplicationFactory = S.newClass();
module.exports = ApplicationFactory;

ApplicationFactory.defineProperty("applications", { BATAILLE : "bataille"});

ApplicationFactory.extendPrototype({
    construct() {
    },
    get(key, socket, token) {
        switch(key) {
            case ApplicationFactory.applications.BATAILLE :
                return { gameKey : 'bataille' };
            default :
                throw new Error("application.unknown");
        }
    }
});