# responsive-components
Organised responsive components system in less for node.

## Installation
```shell
  npm install responsive-components
```
## Usage
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

responsive.update(config)
```

## Release History

* 1.0.0 Initial release
* 1.0.1 Cleanup debugging functions
* 1.0.2 Proper module exports
* 1.0.3 Fix function naming and namespace in less 
* 1.0.4 Add dependencies in package
* 1.0.5 Add media for platform 