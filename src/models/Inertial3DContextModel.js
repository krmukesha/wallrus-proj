import Quaternion from "quaternion";
import { GetEulerRotation } from "../helpers/quaternion_helper";

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
      q: Quaternion(),
    },
    ipt: {
      x_dist_v: 0,
      y_dist_v: 0,
      z_dist_v: 0,
      x_dist_a: 0,
      y_dist_a: 0,
      z_dist_a: 0,
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
      q: Quaternion(),
    },
    ipt: {
      x_dist_v: 0,
      y_dist_v: 0,
      z_dist_v: 0,
      x_dist_a: 0,
      y_dist_a: 0,
      z_dist_a: 0,
    },
    datapoints: 0,
  },
  deltas: {
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
      q: Quaternion(),
    },
    ipt: {
      x_dist_v: 0,
      y_dist_v: 0,
      z_dist_v: 0,
      x_dist_a: 0,
      y_dist_a: 0,
      z_dist_a: 0,
    },
    isUpdated: false,
  },
  currentTime: 0,
  previousTime: 0,
};

// eslint-disable-next-line no-var
var Inertial3DContextModel = function () {
  if (this instanceof Inertial3DContextModel) {
    this.previous = {
      mov: {},
      rot: {},
      ipt: {},
      datapoints: 0,
    };
    this.current = {
      mov: {},
      rot: {},
      ipt: {},
      datapoints: 0,
    };
    this.deltas = {
      mov: {},
      rot: {},
      ipt: {},
    };
    this.currentTime = window.performance.now();
    this.previousTime = window.performance.now();
    const setMotionData = (_this, lData) => {
      const { x, y, z, vx, vy, vz, ax, ay, az } = lData;
      //  Position
      _this.x = x;
      _this.y = y;
      _this.z = z;
      //  Speed / Velocity
      _this.vx = vx;
      _this.vy = vy;
      _this.vz = vz;
      //  Acceleration
      _this.ax = ax;
      _this.ay = ay;
      _this.az = az;
    };
    const setRotationData = (_this, lData) => {
      const { yaw, pitch, roll, q } = lData;
      _this.yaw = yaw;
      _this.pitch = pitch;
      _this.roll = roll;
      _this.q = q;
    };
    const setIPTData = (_this, lData) => {
      const { x_dist_v, y_dist_v, z_dist_v, x_dist_a, y_dist_a, z_dist_a } =
        lData;
      //  Distance due to velocity
      _this.x_dist_v = x_dist_v;
      _this.y_dist_v = y_dist_v;
      _this.z_dist_v = z_dist_v;
      //  Distance due to acceleration
      _this.x_dist_a = x_dist_a;
      _this.y_dist_a = y_dist_a;
      _this.z_dist_a = z_dist_a;
    };

    const previousData = data.previous;
    const currentData = data.current;
    const deltasData = data.deltas;

    // Set previous data
    setMotionData(this.previous.mov, previousData.mov);
    setRotationData(this.previous.rot, previousData.rot);
    this.previous.datapoints = previousData.datapoints;
    setIPTData(this.previous.ipt, previousData.ipt);

    // Set current data
    setMotionData(this.current.mov, currentData.mov);
    setRotationData(this.current.rot, currentData.rot);
    this.current.datapoints = currentData.datapoints;
    setIPTData(this.current.ipt, currentData.ipt);

    // Set deltas data
    setMotionData(this.deltas.mov, deltasData.mov);
    setRotationData(this.deltas.rot, deltasData.rot);
    setIPTData(this.deltas.ipt, deltasData.ipt);
  } else {
    return new Inertial3DContextModel();
  }
};

Inertial3DContextModel.prototype = {
  incrementCurrentDataPoints: function (inc = 1) {
    return (this.current.datapoints = this.current.datapoints + inc);
  },
  incrementPreviousDataPoints: function (inc = 1) {
    return (this.previous.datapoints = this.previous.datapoints + inc);
  },
  setPreviousPosition: function ({ x, y, z }) {
    return (this.previous.mov = { ...this.previous.mov, x: x, y: y, z: z });
  },
  setPreviousVelocity: function ({ vx, vy, vz }) {
    return (this.previous.mov = {
      ...this.previous.mov,
      vx: vx,
      vy: vy,
      vz: vz,
    });
  },
  setPreviousAcceleration: function ({ ax, ay, az }) {
    return (this.previous.mov = {
      ...this.previous.mov,
      ax: ax,
      ay: ay,
      az: az,
    });
  },
  setPreviousRotation: function ({ yaw, pitch, roll, q }) {
    return (this.previous.rot = {
      ...this.previous.rot,
      yaw: yaw,
      pitch: pitch,
      roll: roll,
      q: q,
    });
  },
  setPreviousIPTDistanceDue2Vel: function ({ x_dist_v, y_dist_v, z_dist_v }) {
    return (this.previous.ipt = {
      ...this.previous.ipt,
      x_dist_v: x_dist_v,
      y_dist_v: y_dist_v,
      z_dist_v: z_dist_v,
    });
  },
  setPreviousIPTDistanceDue2Acc: function ({ x_dist_a, y_dist_a, z_dist_a }) {
    return (this.previous.ipt = {
      ...this.previous.ipt,
      x_dist_a: x_dist_a,
      y_dist_a: y_dist_a,
      z_dist_a: z_dist_a,
    });
  },
  getPreviousPosition: function () {
    return Object.fromEntries(
      Object.entries({ ...this.previous.mov }).slice(0, 3),
    );
  },
  getPreviousVelocity: function () {
    return Object.fromEntries(
      Object.entries({ ...this.previous.mov }).slice(3, 6),
    );
  },
  getPreviousAcceleration: function () {
    return Object.fromEntries(
      Object.entries({ ...this.previous.mov }).slice(6, 9),
    );
  },
  getPreviousRotation: function () {
    return { ...this.previous.rot };
  },
  getPreviousDatapoints: function () {
    return this.previous.datapoints;
  },
  getPreviousIPTDistanceD2Vel: function () {
    return Object.fromEntries(
      Object.entries({ ...this.previous.ipt }).slice(0, 3),
    );
  },
  getPreviousIPTDistanceD2Acc: function () {
    return Object.fromEntries(
      Object.entries({ ...this.previous.ipt }).slice(3, 6),
    );
  },
  setCurrentPosition: function ({ x, y, z }) {
    return (this.current.mov = { ...this.current.mov, x: x, y: y, z: z });
  },
  setCurrentVelocity: function ({ vx, vy, vz }) {
    return (this.current.mov = {
      ...this.current.mov,
      vx: vx,
      vy: vy,
      vz: vz,
    });
  },
  setCurrentAcceleration: function ({ ax, ay, az }) {
    return (this.current.mov = {
      ...this.current.mov,
      ax: ax,
      ay: ay,
      az: az,
    });
  },
  setCurrentRotation: function ({ yaw, pitch, roll, q }) {
    return (this.current.rot = {
      ...this.current.rot,
      yaw: yaw,
      pitch: pitch,
      roll: roll,
      q: q,
    });
  },
  setCurrentIPTDistanceDue2Vel: function ({ x_dist_v, y_dist_v, z_dist_v }) {
    return (this.current.ipt = {
      ...this.current.ipt,
      x_dist_v: x_dist_v,
      y_dist_v: y_dist_v,
      z_dist_v: z_dist_v,
    });
  },
  setCurrentIPTDistanceDue2Acc: function ({ x_dist_a, y_dist_a, z_dist_a }) {
    return (this.current.ipt = {
      ...this.current.ipt,
      x_dist_a: x_dist_a,
      y_dist_a: y_dist_a,
      z_dist_a: z_dist_a,
    });
  },
  getCurrentPosition: function () {
    return Object.fromEntries(
      Object.entries({ ...this.current.mov }).slice(0, 3),
    );
  },
  getCurrentVelocity: function () {
    return Object.fromEntries(
      Object.entries({ ...this.current.mov }).slice(3, 6),
    );
  },
  getCurrentAcceleration: function () {
    return Object.fromEntries(
      Object.entries({ ...this.current.mov }).slice(6, 9),
    );
  },
  getCurrentRotation: function () {
    return { ...this.current.rot };
  },
  getCurrentDatapoints: function () {
    return this.current.datapoints;
  },
  getCurrentIPTDistanceD2Vel: function () {
    return Object.fromEntries(
      Object.entries({ ...this.current.ipt }).slice(0, 3),
    );
  },
  getCurrentIPTDistanceD2Acc: function () {
    return Object.fromEntries(
      Object.entries({ ...this.current.ipt }).slice(3, 6),
    );
  },
  //
  setDeltasPosition: function ({ x, y, z }) {
    return (this.deltas.mov = { ...this.deltas.mov, x: x, y: y, z: z });
  },
  setDeltasVelocity: function ({ vx, vy, vz }) {
    return (this.deltas.mov = {
      ...this.deltas.mov,
      vx: vx,
      vy: vy,
      vz: vz,
    });
  },
  setDeltasAcceleration: function ({ ax, ay, az }) {
    return (this.deltas.mov = {
      ...this.deltas.mov,
      ax: ax,
      ay: ay,
      az: az,
    });
  },
  setDeltasRotation: function ({ yaw, pitch, roll }) {
    return (this.deltas.rot = {
      ...this.deltas.rot,
      yaw: yaw,
      pitch: pitch,
      roll: roll,
    });
  },
  setDeltasIPTDistanceDue2Vel: function ({ x_dist_v, y_dist_v, z_dist_v }) {
    return (this.deltas.ipt = {
      ...this.deltas.ipt,
      x_dist_v: x_dist_v,
      y_dist_v: y_dist_v,
      z_dist_v: z_dist_v,
    });
  },
  setDeltasIPTDistanceDue2Acc: function ({ x_dist_a, y_dist_a, z_dist_a }) {
    return (this.deltas.ipt = {
      ...this.deltas.ipt,
      x_dist_a: x_dist_a,
      y_dist_a: y_dist_a,
      z_dist_a: z_dist_a,
    });
  },
  getDeltasPosition: function ({ gainArray } = { gainArray: [1, 1, 1] }) {
    if (gainArray.length < 3 || gainArray.length > 3)
      console.error("Gain should be a 3 element array.");
    return Object.fromEntries(
      Object.entries({ ...this.deltas.mov })
        .slice(0, 3)
        .map((e, i) => {
          e[1] *= gainArray[i];
          return e;
        }),
    );
  },
  getDeltasPosition4Unreal: function (
    { gainArray = [1, 1, 1], reverseArray = [1, 1, 1] } = {
      gainArray: [1, 1, 1],
      reverseArray: [1, 1, 1],
    },
  ) {
    if (gainArray.length < 3 || gainArray.length > 3)
      console.error("Gain should be a 3 element array.");
    const res = Object.fromEntries(
      Object.entries({ ...this.deltas.mov })
        .slice(0, 3)
        .map((e, i) => {
          e[1] *= gainArray[i] * reverseArray[i]; // add the reverse here
          return e;
        }),
    );
    return {
      x: res.z,
      y: res.x,
      z: res.y,
    };
  },
  getDeltasVelocity: function () {
    return Object.fromEntries(
      Object.entries({ ...this.deltas.mov }).slice(3, 6),
    );
  },
  getDeltasAcceleration: function () {
    return Object.fromEntries(
      Object.entries({ ...this.deltas.mov }).slice(6, 9),
    );
  },
  getDeltasRotation: function () {
    return { ...this.deltas.rot };
  },
  getDeltasDatapoints: function () {
    return this.deltas.datapoints;
  },
  getDeltasIPTDistanceD2Vel: function () {
    return Object.fromEntries(
      Object.entries({ ...this.deltas.ipt }).slice(0, 3),
    );
  },
  getDeltasIPTDistanceD2Acc: function () {
    return Object.fromEntries(
      Object.entries({ ...this.deltas.ipt }).slice(3, 6),
    );
  },
  //
  updatePosition: function (x, y, z) {
    this.setPreviousPosition(this.getCurrentPosition());
    return this.setCurrentPosition({ x, y, z });
  },
  updateVelocity: function (vx, vy, vz) {
    this.setPreviousVelocity(this.getCurrentVelocity());
    return this.setCurrentVelocity({ vx, vy, vz });
  },
  updateAcceleration: function (ax, ay, az) {
    this.setPreviousAcceleration(this.getCurrentAcceleration());
    return this.setCurrentAcceleration({ ax, ay, az });
  },
  updateRotation: function ({ y, p, r, q }) {
    this.setPreviousRotation(this.getCurrentRotation());
    return this.setCurrentRotation({
      yaw: y,
      pitch: p,
      roll: r,
      q: q,
    });
  },
  updateRotationQ: function (y, p, r) {
    this.setPreviousRotation(this.getCurrentRotation());
    return this.setCurrentRotation({ yaw: y, pitch: p, roll: r });
  },
  updateRotationQE: function (y, p, r) {
    this.setPreviousRotation(this.getCurrentRotation());
    return this.setCurrentRotation({ yaw: y, pitch: p, roll: r });
  },
  updateIPTDistanceD2Vel: function (x, y, z) {
    this.setPreviousIPTDistanceDue2Vel(this.getCurrentIPTDistanceD2Vel());
    return this.setCurrentIPTDistanceDue2Vel({
      x_dist_v: x,
      y_dist_v: y,
      z_dist_v: z,
    });
  },
  updateIPTDistanceD2Acc: function (x, y, z) {
    this.setPreviousIPTDistanceDue2Acc(this.getCurrentIPTDistanceD2Acc());
    return this.setCurrentIPTDistanceDue2Acc({
      x_dist_a: x,
      y_dist_a: y,
      z_dist_a: z,
    });
  },
  getPositionDeltas: function () {
    return {
      dx: this.current.mov.x - this.previous.mov.x,
      dy: this.current.mov.y - this.previous.mov.y,
      dz: this.current.mov.z - this.previous.mov.z,
    };
  },
  getOrientation: function () {
    return {
      yaw: this.current.yaw,
      pitch: this.current.pitch,
      roll: this.current.roll,
    };
  },
  getOrientation4Unreal: function ({ gainArray } = { gainArray: [1, 1, 1] }) {
    return {
      yaw: (this.current.rot.pitch - 90) * gainArray[0],
      pitch: this.current.rot.yaw * -1 * gainArray[1],
      roll: this.current.rot.roll * gainArray[2],
    };
  },
  getOrientationQuat4Unreal: function (
    { gainArray } = { gainArray: [1, 1, 1] },
  ) {
    const angles = GetEulerRotation(this.current.rot.q);
    return {
      yaw: angles.pitch - 90 * gainArray[0],
      pitch: angles.yaw * -1 * gainArray[1],
      roll: angles.roll * gainArray[2],
    };
  },
  getDebugData: function (asString = false) {
    return asString ? JSON.stringify(this) : JSON.parse(JSON.stringify(this));
  },
  getFullDataDump: function (asString = false) {
    return asString ? JSON.stringify(this) : JSON.parse(JSON.stringify(this));
  },
  getCurrentDataDump: function (asString = false) {
    return asString
      ? JSON.stringify(this.current)
      : JSON.parse(JSON.stringify(this.current));
  },
  getPreviousDataDump: function (asString = false) {
    return asString
      ? JSON.stringify(this.previous)
      : JSON.parse(JSON.stringify(this.previous));
  },
  getInitialData: function () {
    return data;
  },
  getVectorMatrixRotation: function (angle, x, y) {
    const matrix = [
      [Math.cos(angle), -Math.sin(angle)],
      [Math.sin(angle), Math.cos(angle)],
    ];

    return {
      x: matrix[0][0] * x + matrix[0][1] * y,
      y: matrix[1][0] * x + matrix[1][1] * y,
    };
  },
};

export default Inertial3DContextModel;
