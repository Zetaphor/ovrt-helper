# OVR Toolkit API Helper

This library wraps the OVR Toolkit API and provides properties and helper methods to make accessing and controlling windows easier. This script will only work when executed within a Custom App browser window in OVR Toolkit.

#### **[OVR Toolkit Custom Apps Wiki Page](http://wiki.ovrtoolkit.co.uk/index.php?title=CustomApps)**

## **Table Of Contents**
* [Methods](#methods)
  * [Creating Windows](#)
    * [Web Window](#web-window)
    * [Desktop Window](#desktop-window)
    * [Application Window](#application-window)
    * [Spawn Window](#spawn-window)
  * [Using Windows](#using-windows)
    * [Get Window Details](#get-window-details)
    * [Close Window](#close-window)
    * [Refresh Web Window](#refresh-web-window)
    * [Get Window Boundaries](#get-window-boundaries)
    * [Set Window Position](#set-window-position)
    * [Set Window Rotation](#set-window-rotation)
    * [Set Window Setting](#set-window-setting)
  * [Messaging](#messaging)
    * [Broadcast To All Web Windows](#broadcast-to-all-web-windows)
    * [Send To A Specific Web Window](#send-to-a-specific-web-window)
  * [Update Properties](#update-properties)
    * [Get Monitor Count](#get-monitor-count)
    * [Get Window Titles](#get-window-titles)
  * [Enable/Disable Updates](#enabledisable-updates)
* [Properties](#properties)
  * [Data Properties](#data-properties)
    * [Total Monitors](#total-monitors)
    * [Window List](#window-list)
    * [Knuckles Finger Curls](#knuckles-finger-curls)
    * [HMD/Controller Positions](#hmdcontroller-positions)
  * [Update Flags](#update-flags)
    * [Toggle Knuckles Finger Curl Updates](#toggle-knuckles-finger-curl-updates)
    * [Toggle Window List Updates](#toggle-window-list-updates)
    * [Toggle HMD/Controller Position Updates](#toggle-hmdcontroller-position-updates)
    * [Toggle Window List Updates](#toggle-window-list-updates)
    * [Toggle Window Move/Resize Updates](#toggle-window-moveresize-updates)
  * [Constants](#constants)
    * [Window Attachment Points](#window-attachment-points)
    * [Window Types](#window-types)
    * [Window Settings](#window-settings)
    * [New Transform](#new-transform)
* [Events](#events)
  * [Window Opened](#window-opened)
  * [Window Closed](#window-closed)
  * [Window Mouse Enter/Leave](#window-mouse-enterleave)
  * [Message Received](#message-received)


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
data | Any | This value will be passed as a second parameter to the callback after the window uid | True

#### Desktop Window
```javascript
ovrt.createDesktopWin(monitorId, callback, data)
```

Argument | Type | Description | Optional
-------- | ---- | ----------- | --------
monitorId | Number | Which display to capture
callback | Function | A function definition to callback once the window is created
data | Any | This value will be passed as a second parameter to the callback after the window uid | True

#### Application Window
```javascript
ovrt.createWin(windowHandle, callback, data)
```

Argument | Type | Description | Optional
-------- | ---- | ----------- | --------
windowHandle | Number | Which display to capture
callback | Function | A function definition to callback once the window is created
data | Any | This value will be passed as a second parameter to the callback after the window uid | True

#### Spawn Window
```javascript
ovrt.requestWinSpawn(type, contents, callback, data, transform)
```

Makes a request to OVRToolkit for a new window to be spawned with the specified properties. `type` must match an [OVR Toolkit window type constant](http://wiki.ovrtoolkit.co.uk/index.php?title=CustomApps#Window_types).

Contents value is determined by the window type. Desktops require a Number monitorId, applicaitions require a Number windowHandle, and web screens require an [OVRWebContents object](http://wiki.ovrtoolkit.co.uk/index.php?title=CustomApps#OVRWebContents). This method is used internally by [`createWin`](#application-window), [`createDesktopWin`](#desktop-window), and [`createWebWin`](#web-window).

Argument | Type | Description | Optional
-------- | ---- | ----------- | --------
type | Number | Which display to capture
contents | Any | This window contents, can be OVRWebContents or Number
callback | Function | A function definition to callback once the window is created
data | Any | This value will be passed as a second parameter to the callback after the window uid | True
transform | Object | This object will be passed to the callback along with the window uid | True


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
data | Any | This value will be passed as a second parameter to the callback after the window details | True

#### Close Window
```javascript
ovrt.closeWin(uid)
```

Close a window.

Argument | Type | Description
-------- | ---- | -----------
uid | Number | The uid of the window to close

#### Refresh Web Window
```javascript
ovrt.refreshWin(uid)
```

Refresh the browser in a web window.

Argument | Type | Description
-------- | ---- | -----------
uid | Number | The uid of the window to refresh

#### Get Window Boundaries
```javascript
ovrt.getWinBounds(uid, callback, data)
```

Get a windows boundaries. Returns an [OVROverlayBounds](http://wiki.ovrtoolkit.co.uk/index.php?title=CustomApps#OVROverlayBounds) object, which is a wrapper for the [Unity's `Bounds` type](https://docs.unity3d.com/ScriptReference/Bounds.html).

Argument | Type | Description | Optional
-------- | ---- | ----------- | --------
uid | Number | The uid of the window to get boundaries for
callback | Function | A function definition to callback once the window is created
data | Any | This value will be passed as a second parameter to the callback after the window boundaries | True

#### Set Window Position
```javascript
ovrt.setWinPosition(uid, pos)
```

Set the windows position in 3D space.

Argument | Type | Description
-------- | ---- | -----------
uid | Number | The uid of the window to update position for
pos | Object | An object containing the properties x, y, and z

#### Set Window Rotation
```javascript
ovrt.setWinPosition(uid, rot)
```

Set the windows rotation in 3D space.

Argument | Type | Description
-------- | ---- | -----------
uid | Number | The uid of the window to update position for
rot | Object | An object containing the properties x, y, and z

#### Set Window Setting
```javascript
ovrt.setWinSetting(uid, setting, value)
```

Set the setting of a window to `value`. See the list of [OVR Tookit window settings](http://wiki.ovrtoolkit.co.uk/index.php?title=CustomApps#Settings).

Argument | Type | Description
-------- | ---- | -----------
uid | Number | The uid of the window to update position for
setting | Number | The number for the setting you want to change
value | Any | The new value for the setting

### Messaging

#### Broadcast To All Web Windows
```javascript
ovrt.broadcastMessage(event, data)
```

Broadcasts a message of type `event` with the payload `data` to all other open web windows.
Only web windows will receive this event.

Argument | Type | Description
-------- | ---- | -----------
event | String | A unique identifier for the message
data | String | The payload to send with the message event

#### Send To A Specific Web Window
```javascript
ovrt.sendMessage(event, data, senderId, targetId)
```

Sends a message of type `event` with the payload `data` to the window `targetId`.
Only the window with whose `uid` matches `targetId` will receive this messaage.
Only web windows will receive this event.

Argument | Type | Description
-------- | ---- | -----------
event | String | A unique identifier for the message
data | String | The payload to send with the message event
senderId | Number | The uid of the sender window
targetId | Number | The uid of the target window

### Update Properties

### Get Monitor Count
```javascript
ovrt.requestMonitorCount(callback, data)
```

Get a count of the total number of physical displays. This is called automatically when this library is first loaded and the value is saved in [`ovrt.totalMonitors`](#total-monitors).

Argument | Type | Description | Optional
-------- | ---- | ----------- | --------
callback | Function | A function definition to callback once the monitor count is retreived
data | Any | This value will be passed as a second parameter to the callback after the monitor count | True

### Get Window Titles
```javascript
ovrt.requestWinTitles(callback, data)
```

Get a count of the total number of physical displays. This function is used internally to update [`ovrt.winTitles`](#window-list) when [`ovrt.updateTitles`](#update-window-list) is `true`.

Argument | Type | Description | Optional
-------- | ---- | ----------- | --------
callback | Function | A function definition to callback once the monitor count is retreived
data | Any | This value will be passed as a second parameter to the callback after the window titles | True

### Enable/Disable Updates

#### Toggle HMD/Controller Position Updates
```javascript
ovrt.setDeviceUpdateFlag(enable)
```

Updates the value of [`ovrt.updateDeviceInfo`](#hmdcontroller-positions). When set to `true` the [`ovrt.deviceInfo`](#hmdcontroller-positions) property will be automatically updated with HMD and controller position data.

Argument | Type | Description
-------- | ---- | -----------
enable | Boolean | Whether to allow device updates

#### Toggle Knuckles Finger Curl Updates
```javascript
ovrt.setFingerUpdateFlag(enable)
```

Updates the value of [`ovrt.updateFingers`](#update-knuckles-finger-curls). When set to `true` the [`ovrt.fingerCurls`](#knuckles-finger-curls) property will be automatically updated with the curls of each finger as read by Knuckles controllers.

Argument | Type | Description
-------- | ---- | -----------
enable | Boolean | Whether to allow finger curl updates

#### Toggle Window List Updates
```javascript
ovrt.setTitlesUpdateFlag(enable)
```

Updates the value of [`ovrt.updateTitles`](#update-window-list). When set to `true` the [`ovrt.winTitles`](#window-list) property will be automatically updated with the list of open windows.

Argument | Type | Description
-------- | ---- | -----------
enable | Boolean | Whether to allow window list updates

#### Toggle Window Move/Resize Updates
```javascript
ovrt.setWinUpdateFlag(enable)
```

Updates the value of [`ovrt.updateWindows`](#window-moveresize-updates). When set to `true` the [`ovrt.onWinTransformChanged`](#window-movedresized) event will be called when the window is moved or resized.

Argument | Type | Description
-------- | ---- | -----------
enable | Boolean | Whether to allow window move/resize updates

## Properties
The following properties are available for reading the state of the OVR Toolkit settings or window update toggles.

### Data Properties

#### Total Monitors
```javascript
ovrt.totalMonitors // Number
```

Contains the total number of attached physical displays. For use with [`ovrt.createDesktopWin`](#desktop-window).

#### Window List
```javascript
ovrt.winTitles // Object
```

When [`ovrt.updateWindows`](#window-list) is `true` this property Contains a list of all currently open windows.

#### Knuckles Finger Curls
```javascript
ovrt.fingerCurls // Object
```

When [`ovrt.updateFingers`](#update-knuckles-finger-curls) is `true` this property contains a list of the curl of each finger as read by Knuckles controllers.

#### HMD/Controller Positions
```javascript
ovrt.deviceInfo // Object
```

When [`ovrt.updateDeviceInfo`](#hmdcontroller-position-updates) is `true` this property contains the positions of the HMD and controllers.

### Update Flags

#### Update Knuckles Finger Curls
```javascript
ovrt.updateFingers // Default: false
```

When set to `true` with [`ovrt.setFingerUpdateFlag`](#toggle-knuckles-finger-curl-updates) the values of the fingers for Knuckles controllers will be stored in [`ovrt.fingerCurls`](#knuckles-finger-curls).

#### Update Window List
```javascript
ovrt.updateTitles // Default: false
```

When set to `true` with [`ovrt.setTitlesUpdateFlag`](#toggle-window-list-updates) the list of open windows will be stored in [`ovrt.winTitles`](#window-list).

#### Window Move/Resize Updates
```javascript
ovrt.updateWindows // Default: false
```

When set to `true` with [`ovrt.setWinUpdateFlag`](#toggle-window-moveresize-updates) the `ovrt.onWinTransformChanged` event will be called whenever a window is moved or resized.

#### HMD/Controller Position Updates
```javascript
ovrt.updateDeviceInfo // Default: false
```

When set to `true` the [`ovrt.deviceInfo`](#hmdcontroller-positions) property will be automatically updated with HMD and controller position data.

### Constants

This library abstracts the integer [constants from the wiki](http://wiki.ovrtoolkit.co.uk/index.php?title=CustomApps#Constants) into objects with memorable keys.

#### Window Attached Device
```javascript
ovrt.winDevices = {
  world: 0,
  hmd: 1,
  leftHand: 2,
  rightHand: 3
}
```

**[Wiki page on devices](http://wiki.ovrtoolkit.co.uk/index.php?title=CustomApps#Devices)**

#### Window Types
```javascript
ovrt.winTypes = {
  web: 0,
  desktop: 1,
  window: 2
}
```

**[Wiki page on window types](http://wiki.ovrtoolkit.co.uk/index.php?title=CustomApps#Window_types)**

#### Window Settings
```javascript
ovrt.winSettings = {
  size: 0,
  opacity: 1,
  curvature: 2,
  framerate: 3,
  ecoMode: 4,
  lookHiding: 5,
  attachedDevice: 6
}
```

**[Wiki page on settings values](http://wiki.ovrtoolkit.co.uk/index.php?title=CustomApps#Settings)**


#### New Transform
```javascript
ovrt.newTransform = {
  posX: 0.0,
  posY: 0.0,
  posZ: 0.0,
  rotX: 0.0,
  rotY: 0.0,
  rotZ: 0.0,
  size: 0.25, // Meters
  opacity: 1.0,
  curvature: 0.0,
  framerate: 60,
  ecoMode: true,
  lookHiding: false,
  attachedDevice: 0,
  shouldSave: false
}
```

**[Wiki page on OVROverlayTransform](http://wiki.ovrtoolkit.co.uk/index.php?title=CustomApps#OVROverlayTransform)**

This object is used if no transform is provided to [`ovrt.requestWinSpawn`](#spawn-window).

## Events
These events are available for you to override with your own function definitions.
### Window Moved/Resized
```javascript
ovrt.onWinTransformChanged(transformUpdate)
```

Only triggers if [`ovrt.updateWindows`](#hmdcontroller-position-updates) is `true`. Sends an [OVRTransformUpdate](http://wiki.ovrtoolkit.co.uk/index.php?title=CustomApps#OVRTransformUpdate) object.


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

### Message Received
```javascript
ovrt.onMessageReceived(message)
```

`message` is a string containing the data sent by [`ovrt.broadcast`](#broadcast-to-all-web-windows) or [`ovrt.sendMessage`](#send-to-a-specific-web-window).