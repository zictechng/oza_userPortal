import React from 'react';
import { Box } from '@chakra-ui/react';
import { PageLayout } from 'layouts/PageLayout';
import HistoryContent from 'views/admin/history/index';

// Transactions page reuses History with full data
export default function Transactions() {
  return <HistoryContent />;
}