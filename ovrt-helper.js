function ovrtWinSpawned (uid) { window.ovrt.completeWinSpawn(uid) }
function ovrtWinDetailed (details) { window.ovrt.completeWinDetails(details) }
function ovrtWinTitles (titles) { window.ovrt.completeWindowTitles(titles) }

function ovrtMonitorTotal (total) { window.ovrt.totalMonitors = total }

let titleTimeout = -1
let titleTimeoutInterval = 5000
function requestIntervalWindowTitles () { window.GetWindowTitles('completeIntervalWinTitles') }
function completeIntervalWinTitles (titles) { window.ovrt.winTitles = titles; window.ovrt.onWinTitlesUpdated(titles) }

let fingersTimeout = -1
let fingerTimeoutInterval = 1000
function requestFingerCurls () { window.GetFingerCurls('completeFingerCurls') }
function completeFingerCurls (curls) { window.ovrt.fingerCurls = curls }

function DevicePositionUpdate (deviceInfo) { if (window.ovrt.updateDeviceInfo) window.ovrt.deviceInfo = deviceInfo }
function OverlayTransformChanged (updateData) { if (window.ovrt.updateWindows) window.ovrt.onWinTransformChanged(updateData) }
function InteractionStateChanged (isInteracting) { window.ovrt.onWinInteractionChanged(isInteracting) }
function ReceiveMessage (message) { window.ovrt.onMessageReceived(message) }
function OverlayOpened (uid) { window.ovrt.onWinOpened(uid) }
function OverlayClosed (uid) { window.ovrt.onWinClosed(uid) }

window.ovrt = {
  /* Constants */
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
    framerate: 60,
    ecoMode: true,
    lookHiding: false,
    attachedDevice: 0,
    shouldSave: false
  },

  totalMonitors: 1,
  fingerCurls: {},
  winTitles: {},
  deviceInfo: {},
  logOutputEl: null,
  oldConsoleLog: null,

  updateFingers: false,
  updateTitles: false,
  updateWindows: false,
  updateDeviceInfo: false,

  spawnQueue: [],
  detailsQueue: [],
  titlesQueue: [],

  // Override these with your own functions
  onWinTransformChanged: function (transformUpdate) { console.log('WinTransformChanged', transformUpdate) },
  onWinOpened: function (uid) { console.log('WindowOpened', uid) },
  onWinClosed: function (uid) { console.log('WindowClosed', uid) },
  onWinInteractionChanged: function (isInteracting) { console.log('WinInteractionChanged', isInteracting) },
  onMessageReceived: function (message) { console.log('MessageReceived', message) },
  onWinTitlesUpdated: function (titles) { console.log('WinTitlesUpdated', titles) },
  onLog: function (logData) { console.info('ConsoleLog', logData) },
  onLogError: function (errorData) { console.info('LoggedError', errorData) },

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
   * Add a request for a window spawn to the queue
   * @param { Number } type
   * @param { * } contents
   * @param { Function } callback
   * @param { Boolean } broadcast
   * @param { Object } transform
   */
  requestWinSpawn: function (type, contents, callback, data, transform) {
    if (typeof shouldSave === 'undefined') shouldSave = false
    if (typeof broadcast === 'undefined') broadcast = true
    if (typeof transform === 'undefined') transform = this.newTransform
    this.windowQueue.push({
      type: type,
      contents: contents,
      callback: callback,
      transform: transform
    })
    SpawnOverlay(JSON.stringify(transform), 'ovrtWinSpawned', data)
  },

  /**
   * Process a window uid returned from SpawnOverlay
   * @param { Number } uid
   */
  completeWinSpawn: function (uid, data) {
    let winData = this.spawnQueue.shift()
    window.SetContents(uid, winData.type, winData.contents)
    windowData.uid = uid
    if (typeof winData.callback === 'function') winData['callback'](winData, data)
  },

  /**
   * Add a request for a windows details to the queue
   * @param { Number } uid
   * @param { String } callback
   * @param { Number } targetId
   */
  requestWinDetails: function (uid, callback, data) {
    this.detailsQueue.push({
      uid: uid,
      callback: callback
    })
    window.GetOverlayTransform(uid, 'ovrtWinDetailed', data)
  },

  /**
   * Process a windows details returned from GetOverlayTransform
   * @param { Object } winTransform
   */
  completeWinDetails: function (winTransform) {
    let winData = this.detailsQueue.shift()
    this.winData.transform = details
    if (typeof winData.callback === 'function') winData['callback'](winData, data)
  },

  /**
   * Request a count of the number of monitors
   * @param { String } callback
   */
  requestMonitorCount: function (callback, data) {
    window.GetMonitorCount(callback, data)
  },

  /**
   * Request an update of the list of open windows
   * @param { String } callback
   * @param { String } data
   */
  requestWinTitles: function (callback, data) {
    this.titlesQueue.push({
      callback: callback,
      data: data
    })
    window.GetWindowTitles('ovrtWinTitles', data)
  },

  /**
   * Process a windows titles returned from GetWindowTitles
   * @param { Object } titles
   * @param { String } data
   */
  completeWindowTitles: function (titles, data) {
    let titleData = this.titlesQueue.shift()
    this.winTitles = titles
    this.onWinTitlesUpdated(titles)
    if (typeof titleData.callback === 'function') titleData['callback'](titles, data)
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
  getWinBounds: function (uid, callback, data) {
    window.GetOverlayBounds(uid, callback, data)
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

  /**
   * Set whether or not the DevicePositionUpdate function is called on controller/HMD movement
   * @param { Boolean } enable
   */
  setDeviceUpdateFlag: function (enable) {
    this.updateDeviceInfo = enable
    window.SendDeviceData(enable)
  },

  /**
   * Set whether or not the Knuckles finger values are regularly updated
   * @param { Boolean } enable
   */
  setFingerUpdateFlag: function (enable) {
    this.updateFingers = enable
    if (this.updateFingers && !window.fingersTimeout) {
      setInterval(window.requestFingerCurls, window.fingerTimeoutInterval)
    } else if (!this.updateFingers) clearInterval(window.fingersTimeout)
  },

  /**
   * Set whether or not the window titles are regularly updated
   * @param { Boolean } enable
   */
  setTitlesUpdateFlag: function (enable) {
    this.updateTitles = enable
    if (this.updateTitles && !window.titleTimeout) {
      setInterval(window.requestIntervalWindowTitles, window.titleTimeoutInterval)
    } else if (!this.updateTitles) clearInterval(window.titleTimeout)
  },

  /**
   * Set whether window position and size events are sent
   * @param { Boolean } enable
   */
  setWinUpdateFlag: function (enable) {
    this.updateWindows = enable
    window.SendOverlayPositions(enable)
  },

  /**
   * Set a windows setting
   * @param { Number } uid
   * @param { Number } setting
   * @param { * } value
   */
  setWinSetting: function (uid, setting, value) {
    window.SetOverlaySetting(uid, setting, value)
  },

  /**
   * Create a new Chromium window
   * @param { String } url
   * @param { Number } width
   * @param { Number } height
   * @param { Function } callback
   */
  createWebWin: function (url, width, height, callback, data) {
    if (typeof width === 'undefined') width = 600
    if (typeof height === 'undefined') height = 600
    let contents = { url: url, width: width, height: height }
    this.requestWinSpawn(this.winTypes.web, contents, callback, data)
  },

  /**
   * Create a new desktop capture window
   * @param { Number } monitorId
   * @param { Function } callback
   */
  createDesktopWin: function (monitorId, callback, data) {
    this.requestWinSpawn(this.winTypes.desktop, monitorId, callback, data)
  },

  /**
   * Create a new application capture window
   * @param { Number } windowHandle
   * @param { Function } callback
   */
  createWin: function (windowHandle, callback, data) {
    this.requestWinSpawn(this.winTypes.window, windowHandle, callback, data)
  },

  setup: function (selector) {
    this.setupLogging(selector)
    GetMonitorCount('ovrtMonitorTotal')
  },

  setupLogging: function (selector) {
    this.logOutputEl = document.querySelector(selector)
    window.onerror = this.logError
    console.log = function (message) {
      let today = new Date()
      let time = `${today.getHours()}:${today.getMinutes()}:${today.getSeconds()}:${today.getMilliseconds()}`
      window.ovrt.addLogLine(`<p class="console-item log-item"><span class="timestamp">${time}</span> <span class="prefix">[LOG]</span>&nbsp;<span class="message">${message}</span></p>`)
    }
  },

  logError: function (errorMsg, url, lineNumber) {
    let today = new Date()
    let time = `${today.getHours()}:${today.getMinutes()}:${today.getSeconds()}:${today.getMilliseconds()}`
    window.ovrt.addLogLine(`<p class="error-item log-item"><span class="timestamp">${time}</span> <span class="prefix">[ERROR]</span> <span class="message">${errorMsg}</span> - <span class="lineNumber">L${lineNumber}</span> - <span class="url">${url}</span></p>`)
    return true
  },

  addLogLine: function (data) {
    if (typeof data === 'object') data = JSON.stringify(data)
    this.logOutputEl.innerHTML += data
  }
}