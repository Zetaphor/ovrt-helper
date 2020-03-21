// window.ovrtWinSpawned = function (uid) { console.log('spawned'); window.ovrt.completeWinSpawn(uid) }
window.ovrtWinDetailed = function (details) { window.ovrt.completeWinDetails(details) }
window.ovrtWinTitles = function (titles) { console.log('Got titles proper'); window.ovrt.completeWindowTitles(titles) }
window.ovrtMonitorTotal = function (total) { window.ovrt.totalMonitors = total }

let titleTimeout = -1
let titleTimeoutInterval = 5000
function requestIntervalWindowTitles () { if (typeof window.GetWindowTitles === 'function') window.GetWindowTitles('completeIntervalWinTitles') }
function completeIntervalWinTitles (titles) { console.log('Titles updated'); window.ovrt.winTitles = titles; window.ovrt.onWinTitlesUpdated(titles) }

let fingersTimeout = -1
let fingerTimeoutInterval = 1000
function requestFingerCurls () { window.GetFingerCurls('completeFingerCurls') }
function completeFingerCurls (curls) { window.ovrt.fingerCurls = curls }

function DevicePositionUpdate (deviceInfo) { if (window.ovrt.updateDeviceInfo) window.ovrt.deviceInfo = deviceInfo }
function OverlayTransformChanged (updateData) { if (window.ovrt.updateWindows) window.ovrt.onWinTransformChanged(updateData) }
function InteractionStateChanged (isInteracting) { window.ovrt.onWinInteractionChanged(isInteracting) }
function ReceiveMessage (message) { console.info('got message'); window.ovrt.onMessageReceived(message) }
function OverlayOpened (uid) { window.ovrt.completeWinSpawn(uid) }
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
  onWinOpened: function (uid) { console.log('LocalWindowOpened', uid) },
  onWinClosed: function (uid) { console.log('WindowClosed', uid) },
  // onWinInteractionChanged: function (isInteracting) { console.log('WinInteractionChanged', isInteracting) },
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
    window.ovrt.spawnQueue.push({
      type: type,
      contents: contents,
      callback: callback,
      data: data,
      transform: transform
    })

    window.SpawnOverlay(JSON.stringify(transform), 'ovrtWinSpawned')
  },

  /**
   * Process a window uid returned from SpawnOverlay
   * @param { Number } uid
   */
  completeWinSpawn: function (uid) {
    let winData = this.spawnQueue.shift()
    let normalizedContents = winData.contents
    if (typeof winData.contents === 'object') normalizedContents = JSON.stringify(winData.contents)
    else normalizedContents = String(normalizedContents)
    let stringContents = JSON.stringify(winData.contents)
    window.SetContents(String(uid), Number(winData.type), normalizedContents)
    windowData.uid = uid
    if (typeof winData.callback === 'function') winData.callback(uid, winData.data)
    this.onWinOpened()
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
      callback: callback,
      data: data
    })
    window.GetOverlayTransform(String(uid), 'ovrtWinDetailed')
  },

  /**
   * Process a windows details returned from GetOverlayTransform
   * @param { Object } winTransform
   */
  completeWinDetails: function (winTransform) {
    console.log('Completed win details')
    let winData = this.detailsQueue.shift()
    if (typeof winData.callback === 'function') winData.callback(winTransform, winData.data)
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
    console.log('Get titles')
    window.GetWindowTitles('ovrtWinTitles')
  },

  /**
   * Process a windows titles returned from GetWindowTitles
   * @param { Object } titles
   * @param { String } data
   */
  completeWindowTitles: function (titles) {
    console.log('Complete titles')
    let titleData = this.titlesQueue.shift()
    this.winTitles = titles
    this.onWinTitlesUpdated(titles)
    if (typeof titleData.callback === 'function') titleData.callback(titles, titleData.data)
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
   * Get the window type
   * @param { Number } uid
   * @param { Function } callback
   */
  getWinType: function (uid, callback) {
    window.GetOverlayType(uid, callback)
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
    console.log = function () {
      let message = ''
      for (let i = 0; i < arguments.length; i++) {
        if (typeof arguments[i] === 'object') message += `${JSON.stringify(arguments[i])}, `
        else message += `${String(arguments[i])}, `
      }
      message = message.substring(0, message.length - 2)
      let today = new Date()
      let time = `${today.getHours()}:${today.getMinutes()}:${today.getSeconds()}:${today.getMilliseconds()}`
      window.ovrt.addLogLine(`<p class="console-item log-item"><span class="timestamp">${time}</span> <span class="prefix">[LOG]</span>&nbsp;<span class="message">${message}</span></p>`)
      window.ovrt.onLog(message)
    }
  },

  logError: function (errorMsg, url, lineNumber) {
    let today = new Date()
    let time = `${today.getHours()}:${today.getMinutes()}:${today.getSeconds()}:${today.getMilliseconds()}`
    window.ovrt.addLogLine(`<p class="error-item log-item"><span class="timestamp">${time}</span> <span class="prefix">[ERROR]</span> <span class="message">${errorMsg}</span> - <span class="lineNumber">L${lineNumber}</span> - <span class="url">${url}</span></p>`)
    window.ovrt.onLogError({
      message: errorMsg,
      url: url,
      lineNumber: lineNumber
    })
    return true
  },

  addLogLine: function (data) {
    if (typeof data === 'object') data = JSON.stringify(data)
    this.logOutputEl.innerHTML += data
  }
}