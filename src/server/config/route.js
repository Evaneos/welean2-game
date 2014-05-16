module.exports = {
    express : {

    },
    routes : [
        {
            url     :  '/',
            method  : 'get',
            controller : 'index'
        },
        {
            url     :  '/:gameKey/create',
            method  : 'get',
            controller : 'roomcreate'
        },
        {
            url     :  '/:token',
            method  : 'get',
            controller : 'smartphone'
        },
        {
            url     :  '/',
            method  : 'get',
            controller : 'test'
        }
    ]
};