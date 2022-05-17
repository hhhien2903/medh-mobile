import { Box, Text } from 'native-base';
import React from 'react';
import { Dimensions } from 'react-native';
export const { width: SIZE } = Dimensions.get('window');
const Chart = (containerStyle, chartPrices, xKey, yKey) => {
  //   let data = chartPrices
  //     ? chartPrices?.map((item, index) => {
  //         return {
  //           x: item[xKey],
  //           y: item[yKey],
  //         };
  //       })
  //     : [];
  //   const points = monotoneCubicInterpolation({ data, range: 40 });
  //   return (
  //     <Box style={{ ...containerStyle }}>
  //       {data.length > 0 && (
  //         <ChartPathProvider data={{ points, smoothingStrategy: 'bezier' }}>
  //           <ChartPath height={150} stroke="yellow" width={SIZE} stroke="yellow" />
  //           {/* <ChartDot style={{ backgroundColor: 'blue' }} /> */}
  //         </ChartPathProvider>
  //       )}
  //     </Box>
  //   );
};

export default Chart;
