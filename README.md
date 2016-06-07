# responsive-components
Organised responsive components system in less for node.

## Installation
```shell
  npm install responsive-components
```
## Usage
### using an configuration object
```js
var responsive = require('responsive-components');
var config = {
    path:"Styles",
    output:"components.less",
    components : [
        "base",
        "button"
    ],
    platforms : {
        base:{},
        mobile:{max:"600px"},
        tablet:{min:"601px", max:"1000px"},
        tabletVertical:{min:"601px", max:"1000px",query:"orientation:vertical"},
        big:{min:"1001px"},
        print:{media:"print"}
    }
}

responsive.update(config);
```
### using an external file
```js
responsive.update("Styles/mycomponents.json"); // using custom path
```

```js
responsive.update(); // will try to find "components.config.json" in the current directory
```

## Configuration
### Config Reference

name | Required | Description
------------ | ------------- | ------------- 
path | false | @string : the relative path. Defaults to "Styles"
output | false | @string : the final output file name. Defaults to "components.less"
components | true | @string[] : the list of component names.
platforms | true | @object[] : the list of platforms as objects as described bellow

### Platform Reference
The platform object supports the following attributes : 

name | Required | Description
------------ | ------------- | ------------- 
min | false | @string : the minimum width. Example : "700px"
max | false | @string : the maximum width. Example : "1024px"
orientation | false | @string : the platform orientation. Example : "vertical"
query | false | @string : additional query. Example : "-webkit-min-device-pixel-ratio:2"
media | false | @string : the platform's media. Defaults to "screen". Example : "print"



## Release History

* 1.0.0 Initial release
* 1.0.1 Cleanup debugging functions
* 1.0.2 Proper module exports
* 1.0.3 Fix function naming and namespace in less 
* 1.0.4 Add dependencies in package
* 1.0.5 Add media for platform 
* 1.0.6 Now accepts path and defaults to components.config.json