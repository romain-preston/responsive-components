var fs = require('fs');
var path = require('path');
var glob = require('glob');
var escape = require('escape-regexp');

const _addComponentFile = (platforms, componentsDir, componentName) => {
    var filepath = componentsDir + "/@" + componentName + ".less";
    var exists = fs.existsSync(filepath);
    var filecontent = "";
    if (!exists) fs.writeFileSync(filepath, "/* Component " + componentName + " */\n\n");
    else filecontent = fs.readFileSync(filepath);

    for (var platformName in platforms) {
        if (!platforms.hasOwnProperty(platformName)) continue;
        var reg = new RegExp(escape("." + componentName + "-" + platformName + "()"), 'ig');
        if (reg.test(filecontent)) continue;
        fs.appendFileSync(filepath, "\n." + componentName + "-" + platformName + "() {\n}\n\n");
    }
    return filepath;
}

const camelToDash = str => str
    .replace(/(^[A-Z])/, (first) => first.toLowerCase())
    .replace(/([A-Z])/g, (letter) => `-${letter.toLowerCase()}`)

var _update = function (config) {

    var basepath = config.path || "Styles";
    var components = typeof config.components === "string" ? [] : config.components;
    var componentsPattern = typeof config.components === "string" ? config.components : "";

    var platforms = config.platforms;
    var componentsDir = basepath + "/components";
    var platformsDir = basepath + "/platforms";
    var componentFiles = [];

    if (!fs.existsSync(basepath)) {
        fs.mkdirSync(basepath);
    }

    if (!fs.existsSync(componentsDir)) {
        fs.mkdirSync(componentsDir);
    }

    if (!fs.existsSync(platformsDir)) {
        fs.mkdirSync(platformsDir);
    }

    for (var i = 0; i < components.length; i++) {
        var componentName = components[i];
        var filepath = _addComponentFile(platforms, omponentsDir, componentName);
        componentFiles.push(filepath);
    }

    // add components using path : 
    if (componentsPattern) {
        // we look for directories
        componentsPattern = componentsPattern[componentsPattern.length] == "/" ? componentsPattern : (componentsPattern + "/");
        glob(componentsPattern, { ignore: ["node_modules"] }, function (er, files) {
            // files is an array of filenames. 
            // If the `nonull` option is set, and nothing 
            // was found, then files is ["**/*.js"] 
            // er is an error object or null. 
            files.forEach(file => {
                var componentName = path.basename(file);
                var filepath = _addComponentFile(platforms, file, camelToDash(componentName));

                componentFiles.push(filepath);
            });
        })

    }

    for (var platformName in platforms) {
        if (!platforms.hasOwnProperty(platformName)) continue;
        var platform = platforms[platformName];
        var filepath = platformsDir + "/@" + platformName + ".less";
        var fileheader = "";
        var filecontent = "/* Platform " + platformName + " */\n\n";
        componentFiles.forEach(componentFile => {
            var componentpath = path.relative(filepath, componentFile);
            fileheader += "@import \"" + componentpath + "\";\n";
        });


        filecontent += "." + platformName + "() {\n";
        for (var i = 0; i < components.length; i++) {
            var componentName = components[i];
            filecontent +=
                "\t/* Component " + componentName + " on " + platformName + " */\n" +
                "\t." + componentName + "-" + platformName + "();\n\n";
        }
        filecontent += "}\n\n";
        fs.writeFileSync(filepath, fileheader + "\n\n" + filecontent);
    }
    var componentsheader = "";
    var componentscontent = "";
    for (var platformName in platforms) {
        if (!platforms.hasOwnProperty(platformName)) continue;
        var platform = platforms[platformName];
        componentsheader += "@import \"platforms/@" + platformName + ".less\";\n";
        var media = platform.media ? platform.media : "screen";
        var mediaQuery = "@media " + media + " ";
        if (platform.min) mediaQuery += " and (min-width: " + platform.min + ")";
        if (platform.max) mediaQuery += " and (max-width: " + platform.max + ")";
        if (platform.orientation) mediaQuery += " and (orientation: " + platform.orientation + ")";
        if (platform.query) mediaQuery += " and (" + platform.query + ")";
        componentscontent += mediaQuery + " {\n\t." + platformName + "();\n}\n\n";
    }
    var output = config.output ? config.output : "components.less";
    fs.writeFileSync(basepath + "/" + output, componentsheader + "\n\n" + componentscontent);
}
module.exports = {
    update: function (config) {
        if (typeof config === "undefined") {
            fs.readFile("components.config.json", "utf-8", function (err, data) {
                _update(JSON.parse(data.trim()));
            });
            return;
        }

        if (typeof config === "string") {
            fs.readFile(config, "utf-8", function (err, data) {
                _update(JSON.parse(data.trim()));
            });
            return;
        }
        _update(config);
    },
    updateSync: function (config) {
        if (typeof config === "undefined") {
            fs.readFileSync("components.config.json", "utf-8", function (err, data) {
                _update(JSON.parse(data.trim()));
            });
            return;
        }

        if (typeof config === "string") {
            fs.readFileSync(config, "utf-8", function (err, data) {
                _update(JSON.parse(data.trim()));
            });
            return;
        }
        _update(config);
    }
}