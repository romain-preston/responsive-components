var fs = require('fs');
var escape = require('escape-regexp');
module.exports = {
  update: function(config) {
        var basepath = config.path;
        var components = config.components;
        var platforms = config.platforms;
        var componentsDir = basepath + "/components";
        var platformsDir = basepath + "/platforms";
        
        if (!fs.existsSync(basepath)){
            fs.mkdirSync(basepath);
        }
        
        if (!fs.existsSync(componentsDir)){
            fs.mkdirSync(componentsDir);
        }
        
        if (!fs.existsSync(platformsDir)){
            fs.mkdirSync(platformsDir);
        }
        
        for(var i= 0;i<components.length; i++){
            var componentName = components[i];
            var filepath = componentsDir+ "/@" + componentName + ".less";
            var exists = fs.existsSync(filepath);
            var filecontent = "";
            if(!exists) fs.writeFileSync(filepath, "/* Component "+componentName+" */\n\n");
            else filecontent = fs.readFileSync(filepath);
            
            for(var platformName in platforms){
                if(!platforms.hasOwnProperty(platformName)) continue;
                var reg = new RegExp(escape("."+componentName +"-" + platformName + "()"),'ig');
                if(reg.test(filecontent)) continue;
                fs.appendFileSync(filepath,"\n."+componentName +"-" + platformName + "() {\n}\n\n"); 
            }
            
        }

        for(var platformName in platforms){
            if(!platforms.hasOwnProperty(platformName)) continue;
            var platform = platforms[platformName];
            var filepath =  platformsDir+ "/@"+platformName+".less";
            var fileheader = "";
            var filecontent = "/* Platform "+platformName+" */\n\n";
            for(var i= 0;i<components.length; i++){
                var componentName = components[i];
                var componentpath = "../components/@" + componentName + ".less";
                fileheader += "@import \"" + componentpath + "\";\n";
            }
            
            filecontent += "."+platformName +"() {\n";
            for(var i= 0;i<components.length; i++){
                var componentName = components[i];
                filecontent += 
                    "\t/* Component "+componentName +" on " + platformName + " */\n" +
                    "\t."+componentName +"-" + platformName + "();\n\n";
            }
            filecontent += "}\n\n";
            fs.writeFileSync(filepath, fileheader+"\n\n" + filecontent);
        }
        var componentsheader = "";
        var componentscontent = "";
        for(var platformName in platforms){
            if(!platforms.hasOwnProperty(platformName)) continue;
            var platform = platforms[platformName];
            componentsheader += "@import \"platforms/@"+platformName+".less\";\n";
            var mediaQuery = "@media screen ";
            if(platform.min) mediaQuery += " and (min-width: "+platform.min+")";
            if(platform.max) mediaQuery += " and (max-width: "+platform.max+")";
            if(platform.query) mediaQuery += " and ("+platform.query+")"; 
            componentscontent += mediaQuery + " {\n\t."+platformName +"();\n}\n\n";
        }
        var output = config.output ? config.output :"components.less";
        fs.writeFileSync(basepath + "/" + output, componentsheader+"\n\n" + componentscontent);
    } 
}
