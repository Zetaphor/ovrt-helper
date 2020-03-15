## Creating Windows
### Web Window
```javascript
ovrt.createWebWin(url, width, height, callback, data)
```

Argument | Type | Description
-------- | ---- | -----------
url | String | URL to open the web screen to
width | Number | The width of the screen in pixels
height | Number | The height of the screen in pixels
callback | String | The name of the callback function
data | String | A string to pass back to the callback

### Desktop Window
```javascript
ovrt.createDesktopWin(monitorId, callback, data)
```

Argument | Type | Description
-------- | ---- | -----------
monitorId | Number | Which display to capture
callback | String | The name of the callback function
data | String | A string to pass back to the callback

### Application Window
```javascript
ovrt.createWindow(windowHandle, callback, data)
```

Argument | Type | Description
-------- | ---- | -----------
windowHandle | Number | Which display to capture
callback | String | The name of the callback function
data | String | A string to pass back to the callback