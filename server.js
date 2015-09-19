var http = require('http');
var client = require('request-json').createClient('https://erikberg.com/');
var _ = require('lodash');
var pad = require('pad');

var port = process.env.PORT || 1337;
http.createServer(function (req, res) {

    client.get('mlb/standings.json', function (err, response, body) {
        res.writeHead(200, { 'Content-Type': 'application/json' });

        var alEast = _(body.standing)
            .where({ conference: 'AL', division: 'E' })
            .sortBy('rank')
            .value();
            
        var formattedAlEastStandings = 
            '```\n' +
            createRow('', '', 'W', 'L', 'GB') + '\n' +
            pad(48, '', '-') + '\n' +
            _.map(alEast, function (t) {
                return createRow(t.ordinal_rank, t.first_name + ' ' + t.last_name, t.won, t.lost, t.games_back);
            }).join('\n') +
            '\n```';
            
        console.log(formattedAlEastStandings);

        res.end(JSON.stringify({
            text: formattedAlEastStandings
        }));
    });

}).listen(port);

console.log('Listening to ' + port);

function createRow(rank, team, wins, losses, gamesBack) {
    return pad(rank, 6) +
        pad(team, 24) +
        pad(6, wins.toString()) +
        pad(6, losses.toString()) +
        pad(6, gamesBack.toString());
}