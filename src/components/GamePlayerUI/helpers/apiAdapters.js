const rad = Math.PI / 180;

export const getVectorMatrixRotation = (radAngle, x, y) => ({
  xPos: x * Math.cos(radAngle) - y * Math.sin(radAngle),
  yPos: x * Math.sin(radAngle) + y * Math.cos(radAngle),
});

export const mapYaw360CounterClockwise = (angle) =>
  angle < 0 ? angle * -1 : 360 - angle;

export const mapYaw360Clockwise = (angle) => (angle > 0 ? angle : 360 - angle);

export const mapAvatarControlDataToMISFormat = ({
  deltaX,
  deltaY,
  deltaZ,
  yaw,
  pitch,
  roll,
  timestamp,
}) => {
  return `${deltaX} ${deltaY} ${deltaZ} ${yaw} ${pitch} ${roll} ${timestamp}`;
};

export const mapTouchScreenForceToAvatarControlMotion = (
  { touchScreenData, ref },
  generateTimestamp,
) => {
  const { xPos: deltaX, yPos: deltaY } = getVectorMatrixRotation(
    ref.pitch * rad,
    touchScreenData.netForce_y,
    touchScreenData.netForce_x,
  );
  return {
    deltaX,
    deltaY,
    deltaZ: 0,
    timestamp:
      generateTimestamp || !touchScreenData.lastUpdated
        ? Date.now()
        : touchScreenData.lastUpdated,
  };
};

export const mapIMUOrientationToAvatarControlData = ({
  data,
  ref,
  plane,
  timestamp,
}) => {
  plane = plane ?? "XZ";

  const { xPos: deltaX, yPos: deltaY } = getVectorMatrixRotation(
    data.pitch * rad,
    ref.deltaX,
    ref.deltaY,
  );

  switch (plane) {
    case "XZ":
      return {
        deltaX,
        deltaY,
        yaw: data.yaw,
        pitch: data.pitch,
        roll: data.roll,
        timestamp: timestamp ?? Date.now(),
      };
    case "XY":
      return {
        deltaX,
        deltaY,
        yaw: data.yaw,
        pitch: data.pitch,
        roll: data.roll,
        timestamp: timestamp ?? Date.now(),
      };
    default:
      return;
  }
};
