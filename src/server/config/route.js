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
            url     :  '/play/:token',
            method  : 'get',
            controller : 'smartphone-get'
        },
        {
            url     :  '/play/:token',
            method  : 'post',
            controller : 'smartphone-post'
        }
    ]
};