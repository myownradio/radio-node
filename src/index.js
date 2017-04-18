// @flow
"use strict";
exports.__esModule = true;
var express = require("express");
var log_utils_1 = require("./utils/log-utils");
var container_1 = require("./core/container");
var fetch_1 = require("./fetch");
var startServer = function (port, backend) {
    var log = log_utils_1.module('app');
    log('info', 'Listening on the port: %d', port);
    log('info', 'Selected backend: %s', backend);
    var app = express();
    var container = new container_1["default"](backend);
    var fetch = fetch_1["default"](backend);
    app.set('view engine', 'jade');
    app.set('views', './views');
    app.get('/', function (req, res) {
        var players = container.players;
        var version = process.env.npm_package_version;
        res.render('index', { players: players, backend: backend, version: version });
    });
    app.get('/stats', function (req, res) {
        res.status(200).json({
            players: container.countPlayers(),
            clients: container.countClients()
        });
    });
    app.use('/audio/:channelId', function (req, res, next) {
        fetch(req.params.channelId)
            .then(function () { return next(); })["catch"](function () { return res.status(404).send('Not found'); });
    });
    app.get('/audio/:channelId', function (req, res) {
        var player = container.createOrGetPlayer(req.params.channelId);
        player.addClient(res);
    });
    app.listen(port);
};
exports["default"] = startServer;
