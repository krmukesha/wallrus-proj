//  const LOW_THRESHOLD = 0.075;
// const LOW_THRESHOLD = 0.5;
const LOW_THRESHOLD = 0.15;
//  .16 .17
const HIGH_THRESHOLD = 100.0;
const CLEAR_SPEED_TIMER_MS = 100;
const DELTA_TO_SECONDS = 0.001;

const DEBUG = false;
const LOG_PREFIX = "[ DEBUG - IPT ]";
const logInfo = (msg, dump) =>
  dump !== "NaN"
    ? DEBUG && console.info(`${LOG_PREFIX}`, msg, dump)
    : DEBUG && console.info(`${LOG_PREFIX}`, msg);

const changeIsAboveThreshold = (currentAccVec, previousAccVec) => {
  return (
    Math.abs(currentAccVec.ax - previousAccVec.ax) >= LOW_THRESHOLD ||
    Math.abs(currentAccVec.ay - previousAccVec.ay) >= LOW_THRESHOLD ||
    Math.abs(currentAccVec.az - previousAccVec.az) >= LOW_THRESHOLD
  );
};

const changeIsBelowThreshold = (currentAccVec, previousAccVec) => {
  return (
    Math.abs(currentAccVec.ax - previousAccVec.ax) <= HIGH_THRESHOLD &&
    Math.abs(currentAccVec.ay - previousAccVec.ay) <= HIGH_THRESHOLD &&
    Math.abs(currentAccVec.az - previousAccVec.az) <= HIGH_THRESHOLD
  );
};

/**
 * All deltas will be set to 0 except for the acceleration deltas
 */
const resetDeltas = (_this) => {
  //  Update deltas
  _this.setDeltasPosition({
    x: 0,
    y: 0,
    z: 0,
  });

  _this.setDeltasVelocity({
    vx: 0,
    vy: 0,
    vz: 0,
  });

  _this.setDeltasIPTDistanceDue2Vel({
    x_dist_v: 0,
    y_dist_v: 0,
    z_dist_v: 0,
  });

  _this.setDeltasIPTDistanceDue2Acc({
    x_dist_a: 0,
    y_dist_a: 0,
    z_dist_a: 0,
  });
};

//  TODO : Remove bypass, update acceleration with new values?
function pollPositionAllAxes(resetClearSpeedTimer) {
  // const bypass = true;

  const {
    ax: currentXAcceleration,
    ay: currentYAcceleration,
    az: currentZAcceleration,
  } = this.getCurrentAcceleration();

  const {
    ax: previousXAcceleration,
    ay: previousYAcceleration,
    az: previousZAcceleration,
  } = this.getPreviousAcceleration();

  // const accelerationXDelta = currentXAcceleration
  this.setDeltasAcceleration({
    ax: currentXAcceleration - previousXAcceleration,
    ay: currentYAcceleration - previousYAcceleration,
    az: currentZAcceleration - previousZAcceleration,
  });

  logInfo(
    "Step 2 - Acceleration",
    JSON.stringify({
      ax: currentXAcceleration,
      ay: currentYAcceleration,
      az: currentZAcceleration,
    }),
  );

  const bypass = false;
  if (
    (changeIsAboveThreshold(
      {
        ax: currentXAcceleration,
        ay: currentYAcceleration,
        az: currentZAcceleration,
      },
      {
        ax: previousXAcceleration,
        ay: previousYAcceleration,
        az: previousZAcceleration,
      },
    ) &&
      changeIsBelowThreshold(
        {
          ax: currentXAcceleration,
          ay: currentYAcceleration,
          az: currentZAcceleration,
        },
        {
          ax: previousXAcceleration,
          ay: previousYAcceleration,
          az: previousZAcceleration,
        },
      )) ||
    bypass
  ) {
    this.currentTime = window.performance.now();
    logInfo("Step 3 - Current time [ms]", this.currentTime);

    const deltaTime = this.currentTime - this.previousTime;
    logInfo("Step 4 - Delta time [ms]", deltaTime);

    // const distanceDueToAcceleration =
    //   (currentAcceleration * Math.pow(deltaTime, 2)) / 2;
    const xDistanceDueToAcceleration =
      (currentXAcceleration * Math.pow(deltaTime * DELTA_TO_SECONDS, 2)) / 2;
    const yDistanceDueToAcceleration =
      (currentYAcceleration * Math.pow(deltaTime * DELTA_TO_SECONDS, 2)) / 2;
    const zDistanceDueToAcceleration =
      (currentZAcceleration * Math.pow(deltaTime * DELTA_TO_SECONDS, 2)) / 2;
    logInfo(
      "Step 5 - Distance due to acceleration",
      JSON.stringify({
        xDistanceDueToAcceleration,
        yDistanceDueToAcceleration,
        zDistanceDueToAcceleration,
      }),
    );
    // const distanceDueToVelocity = previousVelocity * deltaTime;
    const {
      vx: previousXVelocity,
      vy: previousYVelocity,
      vz: previousZVelocity,
    } = this.getPreviousVelocity();
    const xDistanceDueToVelocity =
      previousXVelocity * deltaTime * DELTA_TO_SECONDS;
    const yDistanceDueToVelocity =
      previousYVelocity * deltaTime * DELTA_TO_SECONDS;
    const zDistanceDueToVelocity =
      previousZVelocity * deltaTime * DELTA_TO_SECONDS;
    logInfo(
      "Step 6 - Distance due to speed",
      JSON.stringify({
        xDistanceDueToVelocity,
        yDistanceDueToVelocity,
        zDistanceDueToVelocity,
      }),
    );

    const xDistance = xDistanceDueToVelocity + xDistanceDueToAcceleration;
    const yDistance = yDistanceDueToVelocity + yDistanceDueToAcceleration;
    const zDistance = zDistanceDueToVelocity + zDistanceDueToAcceleration;
    logInfo(
      "Step 7 - Position Deltas",
      JSON.stringify({
        xDistance,
        yDistance,
        zDistance,
      }),
    );

    // previousPosition = currentPosition;
    // currentPosition = previousPosition + distance;
    const {
      x: previousXPosition,
      y: previousYPosition,
      z: previousZPosition,
    } = this.getPreviousPosition();
    // console.log(previousXPosition, previousZPosition);
    // this.updatePosition(
    //   !isNaN(previousXPosition + xDistance) ? previousXPosition + xDistance : 0,
    //   !isNaN(previousYPosition + yDistance) ? previousYPosition + yDistance : 0,
    //   !isNaN(previousZPosition + zDistance) ? previousZPosition + zDistance : 0,
    // );
    this.updatePosition(
      previousXPosition + xDistance,
      previousYPosition + yDistance,
      previousZPosition + zDistance,
    );

    // lastTime = currentTime;
    this.previousTime = this.currentTime;

    // TODO :: New formula => v(t) = a'(t) * dt + v(t-1) || dx/dt * t + v(t-1)
    // previousVelocity = (currentPosition - previousPosition) / deltaTime;
    const currentXVelocity = xDistance / (deltaTime * DELTA_TO_SECONDS);
    const currentYVelocity = yDistance / (deltaTime * DELTA_TO_SECONDS);
    const currentZVelocity = zDistance / (deltaTime * DELTA_TO_SECONDS);
    // const currentXVelocity = !isNaN(xDistance / (deltaTime * DELTA_TO_SECONDS))
    //   ? xDistance / (deltaTime * DELTA_TO_SECONDS)
    //   : 0;
    // const currentYVelocity = !isNaN(yDistance / (deltaTime * DELTA_TO_SECONDS))
    //   ? yDistance / (deltaTime * DELTA_TO_SECONDS)
    //   : 0;
    // const currentZVelocity = !isNaN(zDistance / (deltaTime * DELTA_TO_SECONDS))
    //   ? zDistance / (deltaTime * DELTA_TO_SECONDS)
    //   : 0;
    this.setPreviousVelocity({
      vx: currentXVelocity,
      vy: currentYVelocity,
      vz: currentZVelocity,
    });

    //  Debugging data
    this.updateIPTDistanceD2Acc(
      xDistanceDueToAcceleration,
      yDistanceDueToAcceleration,
      zDistanceDueToAcceleration,
    );
    this.updateIPTDistanceD2Vel(
      xDistanceDueToVelocity,
      yDistanceDueToVelocity,
      zDistanceDueToVelocity,
    );

    //  Update deltas
    this.setDeltasPosition({
      x: xDistance,
      y: yDistance,
      z: zDistance,
    });

    this.setDeltasVelocity({
      vx: currentXVelocity - previousXVelocity,
      vy: currentYVelocity - previousYVelocity,
      vz: currentZVelocity - previousZVelocity,
    });

    this.setDeltasAcceleration({
      ax: currentXAcceleration - previousXAcceleration,
      ay: currentYAcceleration - previousYAcceleration,
      az: currentZAcceleration - previousZAcceleration,
    });

    const {
      x_dist_v: previous_x_dist_v,
      y_dist_v: previous_y_dist_v,
      z_dist_v: previous_z_dist_v,
    } = this.getPreviousIPTDistanceD2Vel();
    this.setDeltasIPTDistanceDue2Vel({
      x_dist_v: xDistanceDueToVelocity - previous_x_dist_v,
      y_dist_v: yDistanceDueToVelocity - previous_y_dist_v,
      z_dist_v: zDistanceDueToVelocity - previous_z_dist_v,
    });

    const {
      x_dist_a: previous_x_dist_a,
      y_dist_a: previous_y_dist_a,
      z_dist_a: previous_z_dist_a,
    } = this.getPreviousIPTDistanceD2Acc();
    this.setDeltasIPTDistanceDue2Acc({
      x_dist_a: xDistanceDueToAcceleration - previous_x_dist_a,
      y_dist_a: yDistanceDueToAcceleration - previous_y_dist_a,
      z_dist_a: zDistanceDueToAcceleration - previous_z_dist_a,
    });

    //  Debugging data
    this.updateIPTDistanceD2Acc(
      xDistanceDueToAcceleration,
      yDistanceDueToAcceleration,
      zDistanceDueToAcceleration,
    );
    this.updateIPTDistanceD2Vel(
      xDistanceDueToVelocity,
      yDistanceDueToVelocity,
      zDistanceDueToVelocity,
    );
    logInfo(
      "Saving values",
      JSON.stringify({
        previousXPosition,
        previousYPosition,
        previousZPosition,
        previousXVelocity,
        previousYVelocity,
        previousZVelocity,
        currentXVelocity,
        currentYVelocity,
        currentZVelocity,
      }),
    );

    // Not needed anymore
    // previousAcceleration = currentAcceleration;

    resetClearSpeedTimer && resetClearSpeedTimer();
  } else {
    this.currentTime = window.performance.now();
    logInfo("Step 3 - Current time", this.currentTime);

    const deltaTime = this.currentTime - this.previousTime;
    logInfo("Step 4 - Delta time", deltaTime);

    const {
      vx: previousXVelocity,
      vy: previousYVelocity,
      vz: previousZVelocity,
    } = this.getPreviousVelocity();

    const {
      x: previousXPosition,
      y: previousYPosition,
      z: previousZPosition,
    } = this.getPreviousPosition();
    this.setCurrentPosition({
      x: previousXPosition + previousXVelocity * deltaTime,
      y: previousYPosition + previousYVelocity * deltaTime,
      z: previousZPosition + previousZVelocity * deltaTime,
    });

    logInfo(
      "Step 5 - Saving values",
      JSON.stringify({
        previousXPosition,
        previousYPosition,
        previousZPosition,
        previousXVelocity,
        previousYVelocity,
        previousZVelocity,
      }),
    );

    this.previousTime = this.currentTime;

    resetDeltas(this);
  }
}

const data = {
  previous: {
    mov: {
      x: 0,
      y: 0,
      z: 0,
      vx: 0,
      vy: 0,
      vz: 0,
      ax: 0,
      ay: 0,
      az: 0,
    },
    rot: {
      yaw: 0,
      pitch: 0,
      roll: 0,
    },
    datapoints: 0,
  },
  current: {
    mov: {
      x: 0,
      y: 0,
      z: 0,
      vx: 0,
      vy: 0,
      vz: 0,
      ax: 0,
      ay: 0,
      az: 0,
    },
    rot: {
      yaw: 0,
      pitch: 0,
      roll: 0,
    },
    datapoints: 0,
  },
  currentTime: 0,
  previousTime: 0,
};
const getInitialData = () => data;

export { getInitialData, pollPositionAllAxes, CLEAR_SPEED_TIMER_MS };
