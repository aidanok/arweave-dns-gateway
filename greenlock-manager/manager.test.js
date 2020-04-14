"use strict";

var Tester = require("greenlock-manager-test");

var Manager = require("./index.js");
var config = {
    configFile: "greenlock-manager-test.delete-me.json"
};

Tester.test(Manager, config)
    .then(function(features) {
        console.info("PASS");
        console.info();
        console.info("Optional Feature Support:");
        features.forEach(function(feature) {
            console.info(feature.supported ? "✓ (YES)" : "✘ (NO) ", feature.description);
        });
        console.info();
    })
    .catch(function(err) {
        console.error("Oops, you broke it. Here are the details:");
        console.error(err.stack);
        console.error();
        console.error("That's all I know.");
    });
