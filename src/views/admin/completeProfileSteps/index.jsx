import React, { useState } from 'react';
import {
  Box, Flex, Text, Icon, Button,
  useColorModeValue, SimpleGrid, Badge,
  Accordion, AccordionItem, AccordionButton,
  AccordionPanel, AccordionIcon,
} from '@chakra-ui/react';
import {
  MdCheckCircle, MdRadioButtonUnchecked,
  MdPerson, MdImage, MdAssignment, MdVerified,
} from 'react-icons/md';
import { useSelector } from 'react-redux';
import { PageLayout, PageCard } from 'layouts/PageLayout';
import ProfileDetailsForm from 'views/admin/completeProfile/CompleteProfileForm';
import ProfileImageUpload from './ProfileImageUploadCard';
import DocumentUpload from './DocumentUploadCard';
import AccountOwnerShip from './AccountOwnershipCard';
import AddressProof from './AddressProofCard';

const StepIndicator = ({ done, label, icon, textColor, subColor, borderColor }) => (
  <Flex align='center' gap='12px'>
    <Box
      w='40px' h='40px' borderRadius='12px'
      bg={done ? 'green.50' : 'gray.50'}
      border='2px solid'
      borderColor={done ? 'green.400' : borderColor}
      display='flex' alignItems='center' justifyContent='center'
      flexShrink='0'>
      <Icon
        as={done ? MdCheckCircle : icon}
        color={done ? 'green.500' : 'gray.400'}
        w='20px' h='20px'
      />
    </Box>
    <Box>
      <Text color={textColor} fontSize='sm' fontWeight='600'>{label}</Text>
      <Badge
        colorScheme={done ? 'green' : 'gray'}
        borderRadius='full' fontSize='10px' px='8px'>
        {done ? 'Completed' : 'Pending'}
      </Badge>
    </Box>
  </Flex>
);

export default function CompleteProfileSteps() {
  const { user } = useSelector(state => state.authUser);
  const userData = user?.userData;

  const textColor = useColorModeValue('navy.700', 'white');
  const subColor = useColorModeValue('gray.500', 'gray.400');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.200');
  const bannerGrad = useColorModeValue(
    'linear-gradient(135deg, #4C5FD5 0%, #6C5CE7 100%)',
    'linear-gradient(135deg, #1E2C5A 0%, #2D3A6A 100%)'
  );

  const steps = [
    { label: 'Personal Details', done: userData?.reg_stage2 === 'Yes', icon: MdPerson },
    { label: 'Profile Photo', done: userData?.reg_stage3 === 'Yes', icon: MdImage },
    { label: 'ID Document', done: userData?.reg_stage4 === 'Yes', icon: MdAssignment },
    { label: 'KYC Approval', done: userData?.acct_approved_status === 'Approved', icon: MdVerified },
  ];

  const completedCount = steps.filter(s => s.done).length;
  const progress = Math.round((completedCount / steps.length) * 100);

  return (
    <PageLayout>
      {/* Banner */}
      <Box bg={bannerGrad} borderRadius='20px' p='28px' mb='24px'
        position='relative' overflow='hidden'>
        <Box position='absolute' top='-30px' right='-30px'
          w='120px' h='120px' borderRadius='full' bg='whiteAlpha.100' />
        <Flex justify='space-between' align='center' position='relative' zIndex='1' flexWrap='wrap' gap='16px'>
          <Box>
            <Text color='white' fontSize='xl' fontWeight='800' mb='4px'>
              Complete Your Profile
            </Text>
            <Text color='whiteAlpha.700' fontSize='sm'>
              {completedCount} of {steps.length} steps completed
            </Text>
          </Box>
          <Box
            w='64px' h='64px' borderRadius='full'
            bg='whiteAlpha.200'
            display='flex' alignItems='center' justifyContent='center'>
            <Text color='white' fontSize='lg' fontWeight='800'>{progress}%</Text>
          </Box>
        </Flex>

        {/* Progress bar */}
        <Box mt='16px' bg='whiteAlpha.300' borderRadius='full' h='6px' position='relative' zIndex='1'>
          <Box
            bg='white' borderRadius='full' h='6px'
            w={`${progress}%`}
            transition='width 0.5s ease'
          />
        </Box>
      </Box>

      <SimpleGrid columns={{ base: 1, lg: 3 }} gap='20px'>
        {/* Steps Overview */}
        <PageCard p='24px'>
          <Text color={textColor} fontWeight='700' fontSize='md' mb='20px'>
            Verification Steps
          </Text>
          <Flex direction='column' gap='16px'>
            {steps.map((step, i) => (
              <StepIndicator
                key={i}
                done={step.done}
                label={step.label}
                icon={step.icon}
                textColor={textColor}
                subColor={subColor}
                borderColor={borderColor}
              />
            ))}
          </Flex>

          {userData?.acct_approved_status === 'Approved' && (
            <Box mt='20px' p='16px' bg='green.50' borderRadius='12px'
              border='1px solid' borderColor='green.200'>
              <Flex align='center' gap='8px'>
                <Icon as={MdCheckCircle} color='green.500' w='20px' h='20px' />
                <Text color='green.700' fontSize='sm' fontWeight='700'>
                  Account Fully Verified!
                </Text>
              </Flex>
            </Box>
          )}
        </PageCard>

        {/* Forms */}
        <Box gridColumn={{ lg: 'span 2' }}>
          <Accordion allowMultiple defaultIndex={[0]}>
            {/* Step 1 — Personal Details */}
            {userData?.reg_stage2 !== 'Yes' && (
              <Box mb='16px'>
                <PageCard p='0' overflow='hidden'>
                  <AccordionItem border='none'>
                    <AccordionButton p='20px'>
                      <Flex flex='1' align='center' gap='12px'>
                        <Icon as={MdPerson} color='brand.500' w='20px' h='20px' />
                        <Text color={textColor} fontWeight='700' fontSize='sm'>
                          Step 1 — Personal Details
                        </Text>
                      </Flex>
                      <AccordionIcon />
                    </AccordionButton>
                    <AccordionPanel px='20px' pb='20px'>
                      <ProfileDetailsForm />
                    </AccordionPanel>
                  </AccordionItem>
                </PageCard>
              </Box>
            )}

            {/* Step 2 — Profile Photo */}
            {userData?.reg_stage3 !== 'Yes' && (
              <Box mb='16px'>
                <PageCard p='0' overflow='hidden'>
                  <AccordionItem border='none'>
                    <AccordionButton p='20px'>
                      <Flex flex='1' align='center' gap='12px'>
                        <Icon as={MdImage} color='brand.500' w='20px' h='20px' />
                        <Text color={textColor} fontWeight='700' fontSize='sm'>
                          Step 2 — Profile Photo
                        </Text>
                      </Flex>
                      <AccordionIcon />
                    </AccordionButton>
                    <AccordionPanel px='20px' pb='20px'>
                      <ProfileImageUpload />
                    </AccordionPanel>
                  </AccordionItem>
                </PageCard>
              </Box>
            )}

            {/* Step 3 — Document Upload */}
            {userData?.reg_stage4 !== 'Yes' && (
              <Box mb='16px'>
                <PageCard p='0' overflow='hidden'>
                  <AccordionItem border='none'>
                    <AccordionButton p='20px'>
                      <Flex flex='1' align='center' gap='12px'>
                        <Icon as={MdAssignment} color='brand.500' w='20px' h='20px' />
                        <Text color={textColor} fontWeight='700' fontSize='sm'>
                          Step 3 — Upload ID Document
                        </Text>
                      </Flex>
                      <AccordionIcon />
                    </AccordionButton>
                    <AccordionPanel px='20px' pb='20px'>
                      <DocumentUpload />
                    </AccordionPanel>
                  </AccordionItem>
                </PageCard>
              </Box>
            )}
          </Accordion>

          {completedCount >= 3 && userData?.acct_approved_status !== 'Approved' && (
            <PageCard p='24px'>
              <Flex align='center' gap='12px'>
                <Icon as={MdVerified} color='orange.400' w='24px' h='24px' />
                <Box>
                  <Text color={textColor} fontSize='sm' fontWeight='700'>
                    Awaiting Admin Approval
                  </Text>
                  <Text color={subColor} fontSize='xs'>
                    Your documents are under review. This usually takes 1-24 hours.
                  </Text>
                </Box>
              </Flex>
            </PageCard>
          )}
        </Box>
      </SimpleGrid>
    </PageLayout>
  );
}