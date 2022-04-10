import React from 'react';
import medHLogo from '../assets/images/med-h-logo.png';
import { Center, Heading, HStack, Image, VStack } from 'native-base';
import AnimatedEllipsis from '@xlanor/react-native-animated-ellipsis';

const LoadingWelcome = () => {
  return (
    <Center mt={140}>
      <Image source={medHLogo} alt="Alternate Text" height={150} resizeMode="contain" />
      <VStack alignItems="center" justifyContent="center" mt="40px">
        <Heading fontWeight="bold" color="coolGray.800" fontSize={25} textAlign="center">
          Your Health
        </Heading>
        <Heading fontWeight="bold" color="coolGray.800" fontSize={25} textAlign="center">
          Our Responsibility
        </Heading>
        <HStack justifyContent="center" mr={3} mt="50%">
          <AnimatedEllipsis
            numberOfDots={3}
            minOpacity={0.4}
            animationDelay={130}
            style={{
              color: '#66ADDE',
              fontSize: 100,
              letterSpacing: -15,
            }}
          />
        </HStack>
      </VStack>
    </Center>
  );
};

export default LoadingWelcome;
