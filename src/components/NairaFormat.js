import React from 'react';
import {
   Text
  
  } from "@chakra-ui/react";

import { NumericFormat } from 'react-number-format';

export function NairaValueFormat({ value }) {
  return (
    <NumericFormat
      value={value}
      displayType={'text'}
      thousandSeparator={true}
      prefix={'\u20A6'}
      renderText={formattedValue => <Text>{formattedValue}</Text>} // <--- Don't forget this!
    />
  );
}