import { BEHAVIOR } from '../constants/BEHAVIOR.js';
import listRecentReviews from '../repo/listRecentReviews.js';
import calibrate from '../srs/calibrate.js';
/** Пороги оценки, подстроенные под скорость этого человека (по последним повторениям с переворотом). */
export default async function loadCalibration() { return calibrate(await listRecentReviews(BEHAVIOR.calib.window)); }
