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

Name | Required | Type | Description | Default | Example
------------ | ------------- | ------------- | ------------- | ------------- | ------------- 
path | false | string | the relative path. | Styles | "Styles"
output | false | string | the final output file name. | components.less | "output.less"
components | true | string[] | the list of component names. |  | ["base", "button" ]
platforms | true | {key:string, platform:object} | the list of platforms as described bellow. |  | { base:{}, tablet:{min:"601px", max:"1000px"}}

### Platform Reference
The platform object supports the following attributes : 

Name | Type | Description | Example
------------ | ------------- | ------------- | ------------- 
min | string | the minimum width | "700px"
max | string | the maximum width | "1024px"
orientation | string | the platform orientation | "vertical"
query | string | additional query | "-webkit-min-device-pixel-ratio:2"
media | string | the platform's media. Defaults to "screen". | "print"


## Release History

* 1.0.0 Initial release
* 1.0.1 Cleanup debugging functions
* 1.0.2 Proper module exports
* 1.0.3 Fix function naming and namespace in less 
* 1.0.4 Add dependencies in package
* 1.0.5 Add media for platform 
* 1.0.6 Now accepts path and defaults to components.config.json