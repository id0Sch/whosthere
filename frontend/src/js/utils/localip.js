export function getLocalIP () {
  return new Promise((resolve, reject) => {
    window.RTCPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection
    const pc = new RTCPeerConnection({iceServers: []})
    const noop = () => {}
    pc.createDataChannel('')    //create a bogus data channel
    pc.createOffer(pc.setLocalDescription.bind(pc), noop)    // create offer and set local description
    pc.onicecandidate = ice => {  //listen for candidate events
      if (!ice || !ice.candidate || !ice.candidate.candidate) return
      const myIP = /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/.exec(ice.candidate.candidate)[1]
      resolve(myIP)
      pc.onicecandidate = noop
    }
  })
}