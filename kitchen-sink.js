// function DevicePositionUpdate (deviceInfo) { window.ovrt.devicePositionUpdate(deviceInfo) }
// function ReceiveMessage (message) { window.ovrt.receiveMessage(message) }
// function InteractionStateChanged (isInteracting) { window.ovrt.InteractionStateChanged(isInteracting) }
function ovrtWinSpawned (uid) { window.ovrt.completeWinSpawn(uid) }
function ovrtWinDetailed (details) { window.ovrt.completeWinDetails(details) }
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

  winTitles: {},
  spawnQueue: [],
  detailsQueue: [],

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

  updateWinTitles: function (windowTitles) {
    console.log('WindowTitles:', winTitles)
    this.winTitles = winTitles
  },

  /**
   * Add a request for a window spawn to the queue
   * @param { Number } type
   * @param { * } contents
   * @param { Function } callback
   * @param { Boolean } broadcast
   * @param { Object } transform
   */
  requestWinSpawn: function (type, contents, callback, broadcast, transform) {
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
    SpawnOverlay(JSON.stringify(transform), 'ovrtWinSpawned')
  },

  /**
   * Process a window uid returned from SpawnOverlay
   * @param { Number } uid
   */
  completeWinSpawn: function (uid) {
    let winData = this.spawnQueue.shift()
    window.SetContents(uid, winData.type, winData.contents)
    windowData.uid = uid
    if (winData.broadcast) this.broadcast('winCreated', winData)
    if (typeof winData.callback === 'function') winData['callback'](winData)
  },

  /**
   * Add a request for a windows details to the queue
   * @param { Number } uid
   * @param { String } callback
   * @param { Number } targetId
   */
  requestWinDetails: function (uid, callback, targetId) {
    this.detailsQueue.push({
      uid: uid,
      callback: callback,
      targetId: targetId
    })
    window.GetOverlayTransform(uid, 'ovrtWinDetailed')
  },

  /**
   * Process a windows details returned from GetOverlayTransform
   * @param { Object } winTransform
   */
  completeWinDetails: function (winTransform) {
    let winData = this.detailsQueue.shift()
    this.winData.transform = details
    if (typeof winData.callback === 'function') winData['callback'](winData)
  },

  /**
   * Create a new Chromium window
   * @param { String } url
   * @param { Number } width
   * @param { Number } height
   * @param { Function } callback
   */
  createWebWin: function (url, width, height, callback) {
    if (typeof width === 'undefined') width = 600
    if (typeof height === 'undefined') height = 600
    let contents = { url: url, width: width, height: height }
    this.queueWinSpawn(this.winTypes.web, contents, callback)
  },

  /**
   * Create a new desktop window
   * @param { Number } monitorId
   * @param { Function } callback
   */
  createDesktopWin: function (monitorId, callback) {
    this.queueWinSpawn(this.winTypes.desktop, monitorId, callback)
  },

  /**
   * Create a new application capture window
   * @param { Number } windowHandle
   * @param { Function } callback
   */
  createWindow: function (windowHandle, callback) {
    this.queueWinSpawn(this.winTypes.window, windowHandle, callback)
  },

  /**
   * Close a window
   * @param { Number } uid
   */
  closeWin: function (uid) {
    window.CloseOverlay(uid)
  },

  /**
   * Refresh a web window
   * @param { Number } uid
   */
  refreshWin: function (uid) {
    window.Refresh(uid)
  },

  /**
   * Get a windows Unity bounds
   * @param { Number } uid
   * @param { String } callback
   */
  getWinBounds: function (uid, callback) {
    window.GetOverlayBounds(uid, callback)
  },

  /**
   * Set a windows position
   * @param { Number } uid
   * @param { Object } pos
   */
  setWinPosition: function (uid, pos) {
    window.SetOverlayPosition(uid, pos.x, pos.y, pos.z)
  },

  /**
   * Set a windows rotation
   * @param { Number } uid
   * @param { Object } rot
   */
  setWinRotation: function (uid, rot) {
    window.SetOverlayRotation(uid, rot.x, rot.y, rot.z)
  },

  setDeviceUpdate: function (enable) {
    window.SendDeviceData(enable)
  }
}