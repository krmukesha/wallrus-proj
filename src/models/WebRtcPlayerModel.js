const DEBUG_PREFIX = "[ DEBUG - WebRTC Player ]";

const logInfo = (msg, dump = "NaN") =>
  dump !== "NaN"
    ? console.info(DEBUG_PREFIX, msg, dump)
    : console.info(DEBUG_PREFIX, msg);

// eslint-disable-next-line no-var
var WebRtcPlayer = function (
  parOptions,
  {
    videoContainer,
    videoElement,
    onWebRtcOffer,
    onWebRtcAnswer,
    onWebRtcCandidate,
    onVideoInitialised,
    onDataChannelConnected,
    onDataChannelMessage,
    debugLevel = 0,
  },
) {
  parOptions = parOptions || {};

  //**********************
  //Config setup
  //**********************;
  this.cfg = parOptions.peerConnectionOptions || {};
  this.cfg.sdpSemantics = "unified-plan";
  this.pcClient = null;
  this.dcClient = null;
  this.tnClient = null;

  this.sdpConstraints = {
    offerToReceiveAudio: true,
    offerToReceiveVideo: true,
  };

  // See https://www.w3.org/TR/webrtc/#dom-rtcdatachannelinit for values
  this.dataChannelOptions = { ordered: true };

  //  Load conatiner from parameters
  //  Add this.video to the container

  if (!videoElement) {
    this.logInfo("no videoElement found");
    this.video = this.createWebRtcVideo();
  } else {
    this.logInfo("videoElement found");
    this.video = videoElement;
    let _this = this;
    this.video.addEventListener(
      "loadedmetadata",
      function () {
        logInfo("Video [ref] about to be initalised!"); // this, _this
        if (_this.onVideoInitialised) {
          _this.onVideoInitialised();
        }
      },
      true,
    );
  }
  // this.video = this.createWebRtcVideo();

  if (videoContainer) {
    this.logInfo(
      "Appending video object to video container",
      videoContainer,
      this.video,
    );
    videoContainer.appendChild(this.video);
  }
  this.cfg.offerExtmapAllowMixed = false;

  if (this instanceof WebRtcPlayer) {
    this.videoContainer = videoContainer;
    this.videoElement = videoElement;
    this.onWebRtcOffer = onWebRtcOffer;
    this.onWebRtcAnswer = onWebRtcAnswer;
    this.onWebRtcCandidate = onWebRtcCandidate;
    this.onVideoInitialised = onVideoInitialised;
    this.onDataChannelConnected = onDataChannelConnected;
    this.onDataChannelMessage = onDataChannelMessage;
    this.debugLevel = debugLevel;
  } else {
    return new WebRtcPlayer(parOptions, {
      videoContainer,
      videoElement,
      onWebRtcOffer,
      onWebRtcAnswer,
      onWebRtcCandidate,
      onVideoInitialised,
      onDataChannelConnected,
      onDataChannelMessage,
      debugLevel,
    });
  }
};

//**********************
//Functions
//**********************
WebRtcPlayer.prototype = {
  logInfo(msg, dump = "NaN") {
    if (this.debugLevel > 0)
      return dump !== "NaN"
        ? console.info(DEBUG_PREFIX, msg, dump)
        : console.info(DEBUG_PREFIX, msg);
  },

  //Create Video element and expose that as a parameter
  createWebRtcVideo: function () {
    this.logInfo("createWebRtcVideo");
    let video = document.createElement("video");

    video.id = "streamingVideo";
    video.playsInline = true;

    let _this = this;
    video.addEventListener(
      "loadedmetadata",
      function () {
        this.logInfo("Video about to be initalised!"); // this, _this
        if (_this.onVideoInitialised) {
          _this.onVideoInitialised();
        }
      },
      true,
    );
    return video;
  },

  onsignalingstatechange: function (state) {
    logInfo("signaling state change:", state);
  },

  oniceconnectionstatechange: function (state) {
    logInfo("ice connection state change:", state);
  },

  onicegatheringstatechange: function (state) {
    logInfo("ice gathering state change:", state);
  },

  // handleOnTrack: function (e, _this) {
  handleOnTrack: function (e) {
    this.logInfo("handleOnTrack", e.streams, this.video);
    // console.log(this, _this, e.streams[0]);
    if (this.video.srcObject !== e.streams[0]) {
      this.logInfo("setting video stream from ontrack");
      this.video.srcObject = e.streams[0];
    }
    // console.log(this.video.srcObject);
  },

  setupDataChannel: function (pc, label, options) {
    try {
      let datachannel = pc.createDataChannel(label, options);
      logInfo(`Created datachannel (${label})`);

      datachannel.onopen = function () {
        logInfo(`data channel (${label}) connect`);
        if (this.onDataChannelConnected) {
          this.onDataChannelConnected();
        }
      };

      datachannel.onclose = function () {
        logInfo(`data channel (${label}) closed`);
      };

      datachannel.onmessage = function (e) {
        logInfo(`Got message (${label})`, e.data);
        if (this.onDataChannelMessage) this.onDataChannelMessage(e.data);
      };

      return datachannel;
    } catch (e) {
      console.warn("No data channel", e);
      return null;
    }
  },

  onicecandidate: function (e) {
    this.logInfo("ICE candidate", e);
    if (e.candidate && e.candidate.candidate) {
      this.onWebRtcCandidate(e.candidate);
    }
  },

  //  [ PLAYER ]
  handleCreateOffer: function (pc) {
    let _this = this;
    this.logInfo("handleCreateOffer", { pc }, this.sdpConstraints);
    pc.createOffer(this.sdpConstraints).then(
      function (offer) {
        _this.logInfo("Verify offer", offer.sdp);
        pc.setLocalDescription(offer);
        if (_this.onWebRtcOffer) {
          // (andriy): increase start bitrate from 300 kbps to 20 mbps and max bitrate from 2.5 mbps to 100 mbps
          // (100 mbps means we don't restrict encoder at all)
          // after we `setLocalDescription` because other browsers are not c happy to see google-specific config
          offer.sdp = offer.sdp.replace(
            /(a=fmtp:\d+ .*level-asymmetry-allowed=.*)\r\n/gm,
            "$1;x-google-start-bitrate=10000;x-google-max-bitrate=20000\r\n",
          );
          _this.onWebRtcOffer(offer);
        }
      },
      function () {
        console.error("Couldn't create offer");
      },
    );
  },

  //  [ STREAMER ]
  handleCreateAnswer: function (pc) {
    let _this = this;
    pc.createAnswer(this.sdpConstraints).then(
      function (answer) {
        pc.setLocalDescription(answer);
        if (_this.onWebRtcAnswer) {
          // (andriy): increase start bitrate from 300 kbps to 20 mbps and max bitrate from 2.5 mbps to 100 mbps
          // (100 mbps means we don't restrict encoder at all)
          // after we `setLocalDescription` because other browsers are not c happy to see google-specific config
          answer.sdp = answer.sdp.replace(
            /(a=fmtp:\d+ .*level-asymmetry-allowed=.*)\r\n/gm,
            "$1;x-google-start-bitrate=10000;x-google-max-bitrate=20000\r\n",
          );
          // console.log('mixed-answer',answer, { ...answer, ...additionalMsgParams } )
          // _this.onWebRtcAnswer( {
          //   ...answer,
          //   ...additionalMsgParams} );
          _this.onWebRtcAnswer(answer);
        }
      },
      function () {
        console.error("Couldn't create answer");
      },
    );
  },

  setupPeerConnection: function (pc) {
    this.logInfo("Called setupPeerConnection", pc);
    if (pc.SetBitrate)
      this.logInfo("Hurray! there's RTCPeerConnection.SetBitrate function");

    //Setup peerConnection events
    pc.onsignalingstatechange = this.onsignalingstatechange;
    pc.oniceconnectionstatechange = this.oniceconnectionstatechange;
    pc.onicegatheringstatechange = this.onicegatheringstatechange;

    let _this = this;
    pc.ontrack = function (e) {
      _this.handleOnTrack(e, _this);
    };

    pc.onicecandidate = function (e) {
      _this.onicecandidate(e, _this);
    };
  },

  generateAggregatedStatsFunction: function () {
    if (!this.aggregatedStats) this.aggregatedStats = {};

    return function (stats) {
      //console.log('Printing Stats');

      let newStat = {};
      console.log(
        "----------------------------- Stats start -----------------------------",
      );
      stats.forEach((stat) => {
        //                    console.log(JSON.stringify(stat, undefined, 4));
        if (
          stat.type === "inbound-rtp" &&
          !stat.isRemote &&
          (stat.mediaType === "video" ||
            stat.id.toLowerCase().includes("video"))
        ) {
          newStat.timestamp = stat.timestamp;
          newStat.bytesReceived = stat.bytesReceived;
          newStat.framesDecoded = stat.framesDecoded;
          newStat.packetsLost = stat.packetsLost;
          newStat.bytesReceivedStart =
            this.aggregatedStats && this.aggregatedStats.bytesReceivedStart
              ? this.aggregatedStats.bytesReceivedStart
              : stat.bytesReceived;
          newStat.framesDecodedStart =
            this.aggregatedStats && this.aggregatedStats.framesDecodedStart
              ? this.aggregatedStats.framesDecodedStart
              : stat.framesDecoded;
          newStat.timestampStart =
            this.aggregatedStats && this.aggregatedStats.timestampStart
              ? this.aggregatedStats.timestampStart
              : stat.timestamp;

          if (this.aggregatedStats && this.aggregatedStats.timestamp) {
            if (this.aggregatedStats.bytesReceived) {
              // bitrate = bits received since last time / number of ms since last time
              //This is automatically in kbits (where k=1000) since time is in ms and stat we want is in seconds (so a '* 1000' then a '/ 1000' would negate each other)
              newStat.bitrate =
                (8 *
                  (newStat.bytesReceived -
                    this.aggregatedStats.bytesReceived)) /
                (newStat.timestamp - this.aggregatedStats.timestamp);
              newStat.bitrate = Math.floor(newStat.bitrate);
              newStat.lowBitrate =
                this.aggregatedStats.lowBitrate &&
                this.aggregatedStats.lowBitrate < newStat.bitrate
                  ? this.aggregatedStats.lowBitrate
                  : newStat.bitrate;
              newStat.highBitrate =
                this.aggregatedStats.highBitrate &&
                this.aggregatedStats.highBitrate > newStat.bitrate
                  ? this.aggregatedStats.highBitrate
                  : newStat.bitrate;
            }

            if (this.aggregatedStats.bytesReceivedStart) {
              newStat.avgBitrate =
                (8 *
                  (newStat.bytesReceived -
                    this.aggregatedStats.bytesReceivedStart)) /
                (newStat.timestamp - this.aggregatedStats.timestampStart);
              newStat.avgBitrate = Math.floor(newStat.avgBitrate);
            }

            if (this.aggregatedStats.framesDecoded) {
              // framerate = frames decoded since last time / number of seconds since last time
              newStat.framerate =
                (newStat.framesDecoded - this.aggregatedStats.framesDecoded) /
                ((newStat.timestamp - this.aggregatedStats.timestamp) / 1000);
              newStat.framerate = Math.floor(newStat.framerate);
              newStat.lowFramerate =
                this.aggregatedStats.lowFramerate &&
                this.aggregatedStats.lowFramerate < newStat.framerate
                  ? this.aggregatedStats.lowFramerate
                  : newStat.framerate;
              newStat.highFramerate =
                this.aggregatedStats.highFramerate &&
                this.aggregatedStats.highFramerate > newStat.framerate
                  ? this.aggregatedStats.highFramerate
                  : newStat.framerate;
            }

            if (this.aggregatedStats.framesDecodedStart) {
              newStat.avgframerate =
                (newStat.framesDecoded -
                  this.aggregatedStats.framesDecodedStart) /
                ((newStat.timestamp - this.aggregatedStats.timestampStart) /
                  1000);
              newStat.avgframerate = Math.floor(newStat.avgframerate);
            }
          }
        }

        //Read video track stats
        if (
          stat.type === "track" &&
          (stat.trackIdentifier === "video_label" || stat.kind === "video")
        ) {
          newStat.framesDropped = stat.framesDropped;
          newStat.framesReceived = stat.framesReceived;
          newStat.framesDroppedPercentage =
            (stat.framesDropped / stat.framesReceived) * 100;
          newStat.frameHeight = stat.frameHeight;
          newStat.frameWidth = stat.frameWidth;
          newStat.frameHeightStart =
            this.aggregatedStats && this.aggregatedStats.frameHeightStart
              ? this.aggregatedStats.frameHeightStart
              : stat.frameHeight;
          newStat.frameWidthStart =
            this.aggregatedStats && this.aggregatedStats.frameWidthStart
              ? this.aggregatedStats.frameWidthStart
              : stat.frameWidth;
        }

        if (
          stat.type === "candidate-pair" &&
          Object.prototype.hasOwnProperty.call(stat, "currentRoundTripTime") &&
          stat.currentRoundTripTime !== 0
        ) {
          newStat.currentRoundTripTime = stat.currentRoundTripTime;
        }
      });

      //console.log(JSON.stringify(newStat));
      this.aggregatedStats = newStat;

      if (this.onAggregatedStats) this.onAggregatedStats(newStat);
    };
  },

  //**********************
  //Public functions
  //**********************

  //This is called when revceiving new ice candidates individually instead of part of the offer
  //This is currently not used but would be called externally from this class
  handleCandidateFromServer: function (iceCandidate) {
    this.logInfo("handleCandidateFromServer - ICE candidate: ", iceCandidate);
    let candidate = new RTCIceCandidate(iceCandidate);
    this.pcClient.addIceCandidate(candidate).then(() => {
      this.logInfo("ICE candidate successfully added");
    });
  },

  //Called externaly to create an offer for the server. [ PLAYER ]
  createOffer: function () {
    if (this.pcClient) {
      this.logInfo("Closing existing PeerConnection");
      this.pcClient.close();
      this.pcClient = null;
    }
    this.logInfo("Config: ", this.cfg);
    this.pcClient = new RTCPeerConnection(this.cfg);
    this.logInfo("Before setup: ", JSON.parse(JSON.stringify(this.pcClient)));
    this.setupPeerConnection(this.pcClient);
    this.logInfo("After setup: ", JSON.parse(JSON.stringify(this.pcClient)));
    const _this = this;
    this.dcClient = this.setupDataChannel(
      this.pcClient,
      "cirrus",
      this.dataChannelOptions,
      _this,
    );
    this.handleCreateOffer(this.pcClient);
  },

  //Called externaly to create an offer for the server. [ STREAMER ]
  createAnswer: function () {
    this.handleCreateAnswer(this.pcClient);
  },

  //Called externaly when an offer is received from the server [ STREAMER ]
  receiveOffer: function (offer) {
    this.logInfo(`Received offer:\n${offer}`);

    if (this.pcClient) {
      this.logInfo("Closing existing PeerConnection");
      this.pcClient.close();
      this.pcClient = null;
    }
    this.pcClient = new RTCPeerConnection(this.cfg);
    this.setupPeerConnection(this.pcClient);
    this.dcClient = this.setupDataChannel(
      this.pcClient,
      "cirrus",
      this.dataChannelOptions,
    );

    let offerDesc = new RTCSessionDescription(offer);
    this.pcClient.setRemoteDescription(offerDesc);
  },

  //Called externaly when an answer is received from the server [ PLAYER ]
  receiveAnswer: function (answer) {
    this.logInfo(`Received answer:\n${answer}`);
    let answerDesc = new RTCSessionDescription(answer);
    this.pcClient.setRemoteDescription(answerDesc);
  },

  close: function () {
    if (this.pcClient) {
      this.logInfo("Closing existing peerClient");
      this.pcClient.close();
      this.pcClient = null;
    }
    if (this.aggregateStatsIntervalId)
      clearInterval(this.aggregateStatsIntervalId);
  },

  //Sends data across the datachannel
  send: function (data) {
    if (this.dcClient && this.dcClient.readyState === "open") {
      //console.log('Sending data on dataconnection', this.dcClient)
      this.dcClient.send(data);
    }
  },

  getStats: function (onStats) {
    if (this.pcClient && onStats) {
      this.pcClient.getStats(null).then((stats) => {
        onStats(stats);
      });
    }
  },

  aggregateStats: function (checkInterval) {
    let calcAggregatedStats = this.generateAggregatedStatsFunction();
    let printAggregatedStats = () => {
      this.getStats(calcAggregatedStats);
    };
    this.aggregateStatsIntervalId = setInterval(
      printAggregatedStats,
      checkInterval,
    );
  },
};
export default WebRtcPlayer;
