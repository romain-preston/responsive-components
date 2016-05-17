# responsive-components
Organised responsive components system in less for node.

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
        big:{min:"1001px"}
    }
}

responsive.update(config)
```