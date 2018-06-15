// import {update, animate, present} from 'boxart-functions';

import Box from './box';
import BoxColor from './box-color';
import BoxHeightRatio from './box-height-ratio';
import BoxImage from './box-image';
import BoxInsert from './box-insert';
import BoxReplace from './box-replace';
import BoxText from './box-text';

const types = {
  Box,
  BoxBox: BoxInsert,
  BoxColor,
  BoxHeightRatio,
  BoxImage,
  BoxInsert,
  BoxReplace,
  BoxText,
};

// export const animation = _animation => {
//   const updateElements = {};
//   const animateElements = {};
//   const presentElements = {};
//
//   for (const box of _animation.boxes) {
//     updateElements[box.name] = ((types[box.type] || types.Box).update || types.Box.update)(box);
//     animateElements[box.name] = ((types[box.type] || types.Box).animate || types.Box.animate)(box);
//     presentElements[box.name] = ((types[box.type] || types.Box).present || types.Box.present)(box);
//   }
//
//   return {
//     update: update.elements(updateElements),
//     animate: animate.elements(animateElements),
//     present: present.elements(presentElements),
//   };
// };

export default types;

// export {animation};
