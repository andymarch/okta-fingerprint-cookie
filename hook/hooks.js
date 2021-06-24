'use strict'

module.exports = function(app){
    var hooks = require('../controller/hooks')
    app.route('/').post(hooks.token_enrich)
    app.route('/').get(hooks.token_enrich)
};