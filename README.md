## Events
The following event abstractions are available for you to override with your own function definitions:
```javascript
ovrt.onWinTransformChanged(transformUpdate)
ovrt.onWinOpened(uid)
ovrt.onWinClosed(uid)
ovrt.onWinInteractionChanged(isInteracting)
```

##

## Creating Windows
This library abstracts the window creation process with type-specific helper functions that accept a function definition for a callback instead of a string. These functions will also accept a data object that will be passed to the callback as a final parameter.

### Web Window
```javascript
ovrt.createWebWin(url, width, height, callback, data)
```

Argument | Type | Description
-------- | ---- | -----------
url | String | URL to open the web screen to
width | Number | The width of the screen in pixels
height | Number | The height of the screen in pixels
callback | Function | A function definition to callback once the window is created
data | Object | This object will be passed to the callback along with the window uid

### Desktop Window
```javascript
ovrt.createDesktopWin(monitorId, callback, data)
```

Argument | Type | Description
-------- | ---- | -----------
monitorId | Number | Which display to capture
callback | Function | A function definition to callback once the window is created
data | Object | This object will be passed to the callback along with the window uid

### Application Window
```javascript
ovrt.createWindow(windowHandle, callback, data)
```

Argument | Type | Description
-------- | ---- | -----------
windowHandle | Number | Which display to capture
callback | Function | A function definition to callback once the window is created
data | Object | This object will be passed to the callback along with the window uid

