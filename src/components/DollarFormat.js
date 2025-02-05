import React from 'react';
import {
   Text
  
  } from "@chakra-ui/react";

import { NumericFormat } from 'react-number-format';

export function DollarValueFormat({ value }) {
  return (
    <NumericFormat
      value={value}
      displayType={'text'}
      thousandSeparator={true}
      prefix={'\$'}
      renderText={formattedValue => <Text>{formattedValue}</Text>} // <--- Don't forget this!
    />
  );
}