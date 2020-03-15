## Properties
The following properties are available for reading the state of the OVR Toolkit settings or window update toggles.

### Update Flags

#### Knuckles Finger Updates
```javascript
ovrt.updateFingers // Default: false
```

When set to `true` with `ovrt.setFingerUpdateFlag` the values of the fingers for Knuckles controllers will be stored in `ovrt.fingerCurls`.

#### Window List Updates
```javascript
ovrt.updateTitles // Default: false
```

When set to `true` with `ovrt.setTitlesUpdateFlag` the list of open windows will be stored in `ovrt.winTitles`.

#### Window Move/Resize Updates
```javascript
ovrt.updateWindows // Default: false
```

When set to `true` with `ovrt.setWinUpdateFlag` the `ovrt.onWinTransformChanged` event will be called whenever a window is moved or resized.

#### HMD/Controller Position Updates
```javascript
ovrt.updateWindows // Default: false
```

When set to `true` with `ovrt.setWinUpdateFlag` the `ovrt.onWinTransformChanged` event will be called whenever a window is moved or resized.

## Events
These events are available for you to override with your own function definitions.
### Window Moved/Resized
```javascript
ovrt.onWinTransformChanged(transformUpdate)
```

Only triggers if `ovrt.updateWindows` is `true`. Sends an [OVRTransformUpdate](http://wiki.ovrtoolkit.co.uk/index.php?title=CustomApps#OVRTransformUpdate) object.


### Window Opened
```javascript
ovrt.onWinOpened(uid)
```

`uid` is the ID of the newly opened window.

### Window Closed
```javascript
ovrt.onWinClosed(uid)
```

`uid` is the ID of the closed window.


### Window Mouse enter/leave
```javascript
ovrt.onWinInteractionChanged(isInteracting)
```

`isInteracting` is a boolean flag for whether or not the mouse is interacting with this window.

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

