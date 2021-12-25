// const rad = Math.PI / 180;
const deg = 180 / Math.PI;

const GetEulerRotationUsingMatrix = (q, order, degrees) => {
  degrees = degrees || true;
  order = order || "ZXY";
  const matrix4 = q.conjugate().toMatrix4();

  switch (order) {
    case "ZXY":
      return matrix4[0][0] == 1.0
        ? {
            yaw: 0,
            pitch: 0,
            roll: Math.atan2(matrix4[2], matrix4[11]),
          }
        : matrix4[0][0] == -1.0
        ? {
            yaw: 0,
            pitch: 0,
            roll: Math.atan2(matrix4[2], matrix4[11]),
          }
        : {
            // yaw: !degrees
            //   ? Math.atan2(-matrix4[2], matrix4[0])
            //   : Math.atan2(-matrix4[2], matrix4[0]) * deg,
            // pitch: !degrees
            //   ? Math.asin(matrix4[4])
            //   : Math.asin(matrix4[4]) * deg,
            // roll: !degrees
            //   ? Math.atan2(-matrix4[6], matrix4[5])
            //   : Math.atan2(-matrix4[6], matrix4[5]) * deg,

            yaw: !degrees ? Math.asin(matrix4[4]) : Math.asin(matrix4[4]) * deg,
            pitch: !degrees
              ? Math.atan2(-matrix4[6], matrix4[5])
              : Math.atan2(-matrix4[6], matrix4[5]) * deg,
            roll: !degrees
              ? Math.atan2(-matrix4[2], matrix4[0])
              : Math.atan2(-matrix4[2], matrix4[0]) * deg,
          };
    default:
      break;
  }
  // return matrix4[0][0] == 1.0
  //   ? {
  //       // yaw: Math.atan2(matrix4[0][2], matrix4[2][3]),
  //       yaw: Math.atan2(matrix4[2], matrix4[11]),
  //       pitch: 0,
  //       Roll: 0,
  //     }
  //   : matrix4[0][0] == -1.0
  //   ? {
  //       // yaw: Math.atan2(matrix4[0][2], matrix4[2][3]),
  //       yaw: Math.atan2(matrix4[2], matrix4[11]),
  //       pitch: 0,
  //       roll: 0,
  //     }
  //   : {
  //       // yaw: Math.atan2(-matrix4[2][0], matrix4[0][0]),
  //       // pitch: Math.asin(matrix4[1][0]),
  //       // roll: Math.atan2(-matrix4[1][2], matrix4[1][1]),
  //       yaw: !degrees
  //         ? Math.atan2(-matrix4[2], matrix4[0])
  //         : Math.atan2(-matrix4[2], matrix4[0]) * deg,
  //       pitch: !degrees ? Math.asin(matrix4[4]) : Math.asin(matrix4[4]) * deg,
  //       roll: !degrees
  //         ? Math.atan2(-matrix4[6], matrix4[5])
  //         : Math.atan2(-matrix4[6], matrix4[5]) * deg,
  //     };
};

const GetEulerRotation2 = (q, order, degrees) => {
  order = order || "ZXY";
  degrees = degrees || true;

  let heading, attitude, bank, test;
  const { w, x, y, z } = q;

  switch (order) {
    case "YZX":
      test = x * y + z * w;
      if (test > 0.499) {
        // singularity at north pole
        heading = 2 * Math.atan2(x, w);
        attitude = Math.PI / 2;
        bank = 0;
      }
      if (test < -0.499) {
        // singularity at south pole
        heading = -2 * Math.atan2(x, w);
        attitude = -Math.PI / 2;
        bank = 0;
      }
      if (isNaN(heading)) {
        let sqx = x * x;
        let sqy = y * y;
        let sqz = z * z;
        heading = Math.atan2(2 * y * w - 2 * x * z, 1 - 2 * sqy - 2 * sqz); // Heading
        attitude = Math.asin(2 * test); // attitude
        bank = Math.atan2(2 * x * w - 2 * y * z, 1 - 2 * sqx - 2 * sqz); // bank
      }
      break;
    case "ZXY":
      test = x * y + z * w;
      if (test > 0.499) {
        // singularity at north pole
        heading = 0;
        attitude = Math.PI / 2;
        bank = 2 * Math.atan2(x, w);
      }
      if (test < -0.499) {
        // singularity at south pole
        heading = 0;
        attitude = -Math.PI / 2;
        bank = -2 * Math.atan2(x, w);
      }
      if (isNaN(heading)) {
        let sqx = x * x;
        let sqy = y * y;
        let sqz = z * z;
        heading = Math.atan2(2 * x * w - 2 * y * z, 1 - 2 * sqx - 2 * sqz); // bank
        attitude = Math.asin(2 * test); // attitude
        bank = Math.atan2(2 * y * w - 2 * x * z, 1 - 2 * sqy - 2 * sqz); // Heading
      }
      break;
    default:
      throw new Error(`Euler order ${order} not supported yet.`);
  }

  return {
    yaw: degrees ? attitude * deg : attitude, // z
    pitch: degrees ? heading * deg : heading, // y
    roll: degrees ? bank * deg : bank, // x
  };
  // target.y = heading;
  // target.z = attitude;
  // target.x = bank;
};

const GetEulerRotation = (q, radians = false) => {
  const { w, x, y, z } = q;
  let t0, t1, t2, t3, t4, roll_x, pitch_y, yaw_z;

  t0 = +2.0 * (w * x + y * z);
  t1 = 1.0 - 2.0 * (x * x + y * y);
  roll_x = Math.atan2(t0, t1);

  t2 = 2.0 * (w * y - z * x);
  t2 = t2 > 1.0 ? 1.0 : t2;
  t2 = t2 < -1.0 ? -1.0 : t2;
  pitch_y = Math.asin(t2);

  t3 = 2.0 * (w * z + x * y);
  t4 = 1.0 - 2.0 * (y * y + z * z);
  yaw_z = Math.atan2(t3, t4);

  return {
    pitch: radians ? roll_x : roll_x * deg,
    roll: radians ? pitch_y : pitch_y * deg,
    yaw: radians ? yaw_z : yaw_z * deg,
  }; // in radians
};
export { GetEulerRotation, GetEulerRotation2, GetEulerRotationUsingMatrix };
