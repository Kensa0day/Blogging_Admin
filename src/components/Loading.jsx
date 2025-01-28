import { LoadingOverlay } from "@mantine/core";
import React from "react";


// const Loading = () => {
//   return (
//     <div className='loading-container'>
//       <div className='loading-wave'>
//         <div className='loading-bar'></div>
//         <div className='loading-bar'></div>
//         <div className='loading-bar'></div>
//         <div className='loading-bar'></div>
//       </div>
//     </div>
//   );
// };

// export default Loading;

export default function Loading({ visible, toggle }) {
  return (
    <LoadingOverlay
      visible={visible}
      zIndex={1000}
      transition='fade'
      overlayProps={{radius: "sm", blur: 2}}
      loaderProps={{color: "blue", type:"bars"}}
    
    />
  )
}