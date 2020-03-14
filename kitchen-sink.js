// function DevicePositionUpdate (deviceInfo) { window.ovrt.devicePositionUpdate(deviceInfo) }
// function ReceiveMessage (message) { window.ovrt.receiveMessage(message) }
// function InteractionStateChanged (isInteracting) { window.ovrt.InteractionStateChanged(isInteracting) }
function ovrtWindowSpawned (uid) { window.ovrt.setupWindow(uid) }
function ovrtWindowTitles (uid) { window.ovrt.updateWindowTitles(uid) }
let titleTimeout = setInterval(ovrtWindowTitles, 5000)

window.ovrt = {
  winDevices: {
    world: 0,
    hmd: 1,
    leftHand: 2,
    rightHand: 3
  },

  winTypes: {
    web: 0,
    desktop: 1,
    window: 2
  },

  winSettings: {
    size: 0,
    opacity: 1,
    curvature: 2,
    framerate: 3,
    ecoMode: 4,
    lookHiding: 5,
    attachedDevice: 6
  },

  newTransform: {
    posX: 0.0,
    posY: 0.0,
    posZ: 0.0,
    rotX: 0.0,
    rotY: 0.0,
    rotZ: 0.0,
    size: 0.25, // Meters
    opacity: 1.0,
    curvature: 0.0,
    ecoMode: true,
    lookHiding: false,
    attachedDevice: 0,
    shouldSave: false
  },

  windowTitles: {},
  windowQueue: [],

  /**
   * Broadcast a message to all open browser instances
   * @param { String } event
   * @param { Object } data
   */
  broadcastMessage: function (event, data) {
    window.BroadcastMessage(JSON.stringify({
      broadcast: true,
      event: event,
      data: data
    }))
  },

  /**
   * Send a message to a specific browser instance
   * @param { String } event
   * @param { Object } data
   * @param { Number } senderId
   * @param { Number } targetId
   */
  sendMessage: function (event, data, senderId, targetId) {
    window.BroadcastMessage(JSON.stringify({
      broadcast: false,
      event: event,
      data: data,
      senderId: senderId,
      targetId: targetId
    }))
  },

  /**
   * Receive a message from another browser instance
   * @param { String } messageStr
   */
  receiveMessage: function (messageStr) {
    let message = JSON.parse(messageStr)
    if (message.broadcast) console.log('Received Broadcast:', message)
    else console.log('Received message:', message)
  },

  updateWindowTitles: function (windowTitles) {
    console.log('WindowTitles:', windowTitles)
    this.windowTitles = windowTitles
  },

  /**
   * Process a window uid returned from SpawnOverlay
   * @param { Number } uid
   */
  setupWindow: function (uid) {
    let windowData = this.windowQueue.shift()
    window.SetContents(uid, windowData.type, windowData.contents)
    windowData.uid = uid
    if (windowData.broadcast) this.broadcast('windowCreated', windowData)
    if (typeof windowData.callback === 'function') windowData['callback'](windowData)
  },

  /**
   * Add a new window to the spawn queue
   * @param { Number } type
   * @param { * } contents
   * @param { Function } callback
   * @param { Boolean } broadcast
   * @param { Object } transform
   */
  queueWindowSpawn: function (type, contents, callback, broadcast, transform) {
    if (typeof shouldSave === 'undefined') shouldSave = false
    if (typeof broadcast === 'undefined') broadcast = true
    if (typeof transform === 'undefined') transform = this.newTransform
    this.windowQueue.push({
      type: type,
      contents: contents,
      callback: callback,
      broadcast: broadcast,
      transform: transform
    })
    SpawnOverlay(JSON.stringify(transform), 'ovrtWindowSpawned')
  },

  /**
   * Create a new Chromium window
   * @param { String } url
   * @param { Number } width
   * @param { Number } height
   * @param { Function } callback
   */
  createWebWindow: function (url, width, height, callback) {
    if (typeof width === 'undefined') width = 600
    if (typeof height === 'undefined') height = 600
    let contents = { url: url, width: width, height: height }
    this.queueWindowSpawn(this.winTypes.web, contents, callback)
  },

  /**
   * Create a new desktop window
   * @param { Number } monitorId
   * @param { Function } callback
   */
  createDesktopWindow: function (monitorId, callback) {
    this.queueWindowSpawn(this.winTypes.desktop, monitorId, callback)
  },

  /**
   * Create a new application capture window
   * @param { Number } windowHandle
   * @param { Function } callback
   */
  createWindow: function (windowHandle, callback) {
    this.queueWindowSpawn(this.winTypes.window, windowHandle, callback)
  }
}