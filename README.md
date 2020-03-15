# OVR Toolkit API Helper

This library wraps the OVR Toolkit API and provides properties and helper methods to make accessing and controlling windows easier. This script will only work when executed within a Custom App browser window in OVR Toolkit.

#### **[OVR Toolkit Custom Apps Wiki Page](http://wiki.ovrtoolkit.co.uk/index.php?title=CustomApps)**

## **Table Of Contents**
* [Methods](#methods)
  * [Creating Windows](#)
    * [Web Window](#web-window)
    * [Desktop Window](#desktop-window)
    * [Application Window](#application-window)
  * [Using Windows](#using-windows)
    * [Get Window Details](#get-window-details)
* [Properties](#properties)
  * [Data Properties](#data-properties)
    * [Total Monitors](#total-monitors)
    * [Window List](#window-list)
    * [Knuckles Finger Curls](#knuckles-finger-curls)
    * [HMD/Controller Positions](#hmdcontroller-positions)
  * [Update Flags](#update-flags)
    * [Knuckles Finger Updates](#knuckles-finger-updates)
    * [Window List Updates](#window-list-updates)
    * [Window Move/Resize Updates](#window-moveresize-updates)
    * [HMD/Controller Position Updates](#hmdcontroller-position-updates)
* [Events](#events)
  * [Window Opened](#window-opened)
  * [Window Closed](#window-closed)
  * [Window Mouse Enter/Leave](#window-mouse-enterleave)


## Methods

### Creating Windows
This library abstracts the window creation process with type-specific helper functions that accept a function definition for a callback instead of a string. These functions will also accept a data object that will be passed to the callback as a final parameter.

#### Web Window
```javascript
ovrt.createWebWin(url, width, height, callback, data)
```

Argument | Type | Description | Optional
-------- | ---- | ----------- | --------
url | String | URL to open the web screen to
width | Number | The width of the screen in pixels
height | Number | The height of the screen in pixels
callback | Function | A function definition to callback once the window is created
data | Object | This object will be passed to the callback along with the window uid | True

#### Desktop Window
```javascript
ovrt.createDesktopWin(monitorId, callback, data)
```

Argument | Type | Description | Optional
-------- | ---- | ----------- | --------
monitorId | Number | Which display to capture
callback | Function | A function definition to callback once the window is created
data | Object | This object will be passed to the callback along with the window uid | True

#### Application Window
```javascript
ovrt.createWin(windowHandle, callback, data)
```

Argument | Type | Description | Optional
-------- | ---- | ----------- | --------
windowHandle | Number | Which display to capture
callback | Function | A function definition to callback once the window is created
data | Object | This object will be passed to the callback along with the window uid | True

### Using Windows

#### Get Window Details
```javascript
ovrt.requestWinDetails(uid, callback, data)
```

Makes a request to OVR Toolkit for a windows [OVROverlayTransform](http://wiki.ovrtoolkit.co.uk/index.php?title=CustomApps#OVROverlayTransform) object.

Argument | Type | Description | Optional
-------- | ---- | ----------- | --------
uid | Number | The uid of the window to get a transform for
callback | Function | A function definition to callback once the window is created
data | Object | This object will be passed to the callback along with the window uid | True


## Properties
The following properties are available for reading the state of the OVR Toolkit settings or window update toggles.

### Data Properties

#### Total Monitors
```javascript
ovrt.totalMonitors // Number
```

Contains the total number of attached physical displays. For use with `ovrt.createDesktopWin`.

#### Window List
```javascript
ovrt.winTitles // Object
```

When `ovrt.updateWindows` is `true` this property Contains a list of all currently open windows.

#### Knuckles Finger Curls
```javascript
ovrt.fingerCurls // Object
```

When `ovrt.updateFingers` is `true` this property contains a list of the curl of each finger as read by Knuckles controllers.

#### HMD/Controller Positions
```javascript
ovrt.deviceInfo // Object
```

When `ovrt.updateDeviceInfo` is `true` this property contains a list of the curl of each finger as read by Knuckles controllers.

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


### Window Mouse Enter/Leave
```javascript
ovrt.onWinInteractionChanged(isInteracting)
```

`isInteracting` is a boolean flag for whether or not the mouse is interacting with this window.

