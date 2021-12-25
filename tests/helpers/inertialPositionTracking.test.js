/**
 * inertialPositionTracking test file
 *
 * Includes:
 * - changeIsAboveThreshold
 *    - threshold was achieved
 *      - on X axis
 *      - on Y axis
 *      - on Z axis
 *    - threshold not achieved
 *      - on all axes
 * - changeIsBelowThreshold
 *    - threshold was achieved
 *      - on all axes
 *    - threshold not achieved
 *      - on one axis
 *      - on two axis
 * - resetDeltas
 *    - test for delta position
 *    - test for delta velocity
 *    - test for delta IPT distance due to vel.
 *    - test for delta IPT distance due to acc.
 * - pollPositionAllAxes
 *    - Intitial case (V(t-1) = 0, P(t-1) = 0)
 *    - V(t-1) not 0, P(t-1) = 0
 *    - V(t-1) not 0, P(t-1) not 0
 */
