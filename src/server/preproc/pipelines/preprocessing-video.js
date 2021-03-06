// configurations
const config = require('../../../config/config');

module.exports = {
    "general": {
        "heartbeat": 2000,
        "pass_binary_messages": true
    },
    "spouts": [
        {
            "name": "video-input",
            "type": "inproc",
            "working_dir": "./spouts",
            "cmd": "kafka-spout.js",
            "init": {
                "kafka_host": config.kafka.host,
                "topic": "video-topic"
            }
        }
    ],
    "bolts": [
        {
            "name": "material-format",
            "type": "inproc",
            "working_dir": "./bolts",
            "cmd": "material-format.js",
            "inputs": [
                { "source": "video-input" }
            ],
            "init": {}
        },
        {
            "name": "dfxp-extract",
            "type": "inproc",
            "working_dir": "./bolts",
            "cmd": "dfxp-extract.js",
            "inputs": [
                { "source": "material-format" }
            ],
            "init": {}
        },
        {
            "name": "wikification",
            "type": "inproc",
            "working_dir": "./bolts",
            "cmd": "wikification.js",
            "inputs": [
                { "source": "dfxp-extract" }
            ],
            "init": {}
        },
        {
            "name": "material-validator",
            "type": "inproc",
            "working_dir": "./bolts",
            "cmd": "material-validator.js",
            "inputs": [
                { "source": "wikification" }
            ],
            "init": {}
        },
        {
            "name": "postgresql-storage",
            "type": "inproc",
            "working_dir": "./bolts",
            "cmd": "postgresql-storage.js",
            "inputs": [
                { "source": "material-validator" }
            ],
            "init": {}
        }
    ],
    "variables": {}
};