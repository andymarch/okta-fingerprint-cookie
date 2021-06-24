'use strict';

exports.token_enrich = function(req, res){
    var structure = {}
    var commands = 'commands'
    structure[commands] = []
  
    var challenge = new URL(req.body.data.context.request.url.value).searchParams.get('code_challenge')
    var command = {
        'type': 'com.okta.access.patch',
        'value': [
            {
              'op': 'add',
              'path': '/claims/fingerprint',
              'value': challenge
            }
        ]
    }
    structure[commands].push(command)
    res.json(structure);
};