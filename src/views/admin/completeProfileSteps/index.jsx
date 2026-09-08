import React, { useState } from 'react';
import {
  Box, Flex, Text, Icon, Button,
  useColorModeValue, Badge, Divider,
  Progress,
} from '@chakra-ui/react';
import {
  MdCheckCircle, MdPerson, MdImage,
  MdAssignment, MdVerified, MdHome,
  MdFace, MdLock, MdArrowForward,
} from 'react-icons/md';
import { useSelector } from 'react-redux';
import { PageLayout, PageCard } from 'layouts/PageLayout';
import ProfileDetailsForm from 'views/admin/completeProfile/CompleteProfileForm';
import ProfileImageUpload from './ProfileImageUploadCard';
import DocumentUpload from './DocumentUploadCard';
import AccountOwnerShip from './AccountOwnershipCard';
import AddressProof from './AddressProofCard';

// All registration steps
const STEPS = [
  {
    id: 1,
    label: 'Personal Details',
    desc: 'Full name, phone, gender and address',
    icon: MdPerson,
    color: '#4C5FD5',
    bg: '#EEF2FF',
    stageKey: 'reg_stage2',
  },
  {
    id: 2,
    label: 'Profile Photo',
    desc: 'Upload a clear photo of your face',
    icon: MdImage,
    color: '#10B981',
    bg: '#D1FAE5',
    stageKey: 'reg_stage3',
  },
  {
    id: 3,
    label: 'ID Document',
    desc: 'Passport, NIN, driving licence or bank statement',
    icon: MdAssignment,
    color: '#F59E0B',
    bg: '#FEF3C7',
    stageKey: 'reg_stage4',
  },
  {
    id: 4,
    label: 'Selfie Verification',
    desc: 'Take a selfie holding your OTP code',
    icon: MdFace,
    color: '#EF4444',
    bg: '#FEE2E2',
    stageKey: 'reg_stage5',
  },
  {
    id: 5,
    label: 'Address Proof',
    desc: 'Utility bill, bank statement or official mail',
    icon: MdHome,
    color: '#8B5CF6',
    bg: '#EDE9FE',
    stageKey: 'reg_stage6',
  },
];

export default function CompleteProfileSteps() {
  const { user } = useSelector(state => state.authUser);
  const userData = user?.userData;

  const textColor = useColorModeValue('navy.700', 'white');
  const subColor = useColorModeValue('gray.500', 'gray.400');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.200');
  const stepBg = useColorModeValue('white', 'navy.800');
  const activeBg = useColorModeValue('brand.50', 'navy.700');
  const doneBg = useColorModeValue('green.50', 'navy.700');
  const bannerGrad = useColorModeValue(
    'linear-gradient(135deg, #4C5FD5 0%, #6C5CE7 100%)',
    'linear-gradient(135deg, #1E2C5A 0%, #2D3A6A 100%)'
  );

  // Check which steps are done
  const isStepDone = (stageKey) => userData?.[stageKey] === 'Yes';

  const completedCount = STEPS.filter(s => isStepDone(s.stageKey)).length;
  const progress = Math.round((completedCount / STEPS.length) * 100);
  const isFullyApproved = userData?.acct_approved_status === 'Approved';

  // Find the first incomplete step to show as active
  const firstIncompleteIndex = STEPS.findIndex(s => !isStepDone(s.stageKey));
  const [activeStep, setActiveStep] = useState(
    firstIncompleteIndex >= 0 ? firstIncompleteIndex : 0
  );

  const currentStep = STEPS[activeStep];

  const getStepForm = (stepId) => {
    switch (stepId) {
      case 1: return <ProfileDetailsForm />;
      case 2: return <ProfileImageUpload />;
      case 3: return <DocumentUpload />;
      case 4: return <AccountOwnerShip />;
      case 5: return <AddressProof />;
      default: return null;
    }
  };

  return (
    <PageLayout>
      {/* Header Banner */}
      <Box bg={bannerGrad} borderRadius='20px' p='28px' mb='24px'
        position='relative' overflow='hidden'>
        <Box position='absolute' top='-40px' right='-40px'
          w='150px' h='150px' borderRadius='full' bg='whiteAlpha.100' />
        <Box position='absolute' bottom='-20px' left='30%'
          w='80px' h='80px' borderRadius='full' bg='whiteAlpha.100' />

        <Flex justify='space-between' align='center'
          position='relative' zIndex='1' flexWrap='wrap' gap='16px' mb='20px'>
          <Box>
            <Text color='white' fontSize='xl' fontWeight='800' mb='4px'>
              Complete Your Registration
            </Text>
            <Text color='whiteAlpha.700' fontSize='sm'>
              {isFullyApproved
                ? '🎉 Your account is fully verified!'
                : `${completedCount} of ${STEPS.length} steps completed — ${STEPS.length - completedCount} remaining`}
            </Text>
          </Box>
          <Box w='64px' h='64px' borderRadius='full'
            bg='whiteAlpha.200'
            display='flex' alignItems='center' justifyContent='center'>
            <Text color='white' fontSize='lg' fontWeight='800'>{progress}%</Text>
          </Box>
        </Flex>

        {/* Progress Bar with clickable step dots */}
        <Box position='relative' zIndex='1'>
          {/* Track line */}
          <Box h='4px' bg='whiteAlpha.300' borderRadius='full' position='relative'>
            <Box
              h='4px' bg='white' borderRadius='full'
              w={`${progress}%`}
              transition='width 0.5s ease'
            />
          </Box>

          {/* Step dots */}
          <Flex justify='space-between' mt='-10px' px='0px'>
            {STEPS.map((step, i) => {
              const done = isStepDone(step.stageKey);
              const isActive = activeStep === i;
              return (
                <Flex
                  key={i}
                  direction='column'
                  align='center'
                  cursor='pointer'
                  onClick={() => setActiveStep(i)}
                  gap='6px'>
                  {/* Dot */}
                  <Box
                    w='24px' h='24px'
                    borderRadius='full'
                    bg={done ? 'white' : isActive ? 'white' : 'whiteAlpha.400'}
                    border='2px solid'
                    borderColor={done ? 'green.400' : isActive ? 'white' : 'whiteAlpha.600'}
                    display='flex' alignItems='center' justifyContent='center'
                    transition='all 0.2s'
                    _hover={{ transform: 'scale(1.2)' }}>
                    {done ? (
                      <Icon as={MdCheckCircle} color='green.500' w='14px' h='14px' />
                    ) : (
                      <Text fontSize='10px' fontWeight='800'
                        color={isActive ? 'brand.500' : 'whiteAlpha.700'}>
                        {step.id}
                      </Text>
                    )}
                  </Box>
                  {/* Label */}
                  <Text
                    fontSize='9px'
                    fontWeight={isActive ? '700' : '400'}
                    color={isActive ? 'white' : 'whiteAlpha.600'}
                    textAlign='center'
                    maxW='60px'
                    noOfLines={1}>
                    {step.label}
                  </Text>
                </Flex>
              );
            })}
          </Flex>
        </Box>
      </Box>

      {/* Fully approved */}
      {isFullyApproved ? (
        <PageCard p='32px' textAlign='center'>
          <Box w='80px' h='80px' borderRadius='full' bg='green.50'
            display='flex' alignItems='center' justifyContent='center' mx='auto' mb='16px'>
            <Icon as={MdCheckCircle} color='green.500' w='48px' h='48px' />
          </Box>
          <Text color={textColor} fontSize='xl' fontWeight='800' mb='8px'>
            Account Fully Verified! 🎉
          </Text>
          <Text color={subColor} fontSize='sm'>
            All your documents have been reviewed and approved.
            You now have full access to all platform features.
          </Text>
        </PageCard>
      ) : (
        <Flex gap='20px' flexDirection={{ base: 'column', lg: 'row' }}>

          {/* Left — Steps sidebar */}
          <Box w={{ base: '100%', lg: '280px' }} flexShrink='0'>
            <PageCard p='16px'>
              <Text color={textColor} fontSize='sm' fontWeight='700' mb='16px'>
                Registration Steps
              </Text>
              <Flex direction='column' gap='8px'>
                {STEPS.map((step, i) => {
                  const done = isStepDone(step.stageKey);
                  const isActive = activeStep === i;
                  return (
                    <Box
                      key={i}
                      p='12px'
                      borderRadius='12px'
                      cursor='pointer'
                      bg={done ? doneBg : isActive ? activeBg : 'transparent'}
                      border='1px solid'
                      borderColor={done ? 'green.200' : isActive ? 'brand.300' : 'transparent'}
                      _hover={{ bg: isActive ? activeBg : doneBg }}
                      transition='all 0.2s'
                      onClick={() => setActiveStep(i)}>
                      <Flex align='center' gap='10px'>
                        <Box
                          w='36px' h='36px' borderRadius='10px'
                          bg={done ? 'green.100' : isActive ? 'brand.100' : step.bg}
                          display='flex' alignItems='center' justifyContent='center'
                          flexShrink='0'>
                          <Icon
                            as={done ? MdCheckCircle : step.icon}
                            color={done ? 'green.500' : isActive ? 'brand.500' : step.color}
                            w='18px' h='18px'
                          />
                        </Box>
                        <Box flex='1' minW='0'>
                          <Text
                            color={done ? 'green.700' : isActive ? 'brand.600' : textColor}
                            fontSize='sm' fontWeight='700' noOfLines={1}>
                            {step.label}
                          </Text>
                          <Badge
                            colorScheme={done ? 'green' : isActive ? 'blue' : 'gray'}
                            borderRadius='full' fontSize='9px' px='6px'>
                            {done ? 'Done' : isActive ? 'In Progress' : 'Pending'}
                          </Badge>
                        </Box>
                      </Flex>
                    </Box>
                  );
                })}
              </Flex>

              {/* Awaiting approval notice */}
              {completedCount === STEPS.length && !isFullyApproved && (
                <Box mt='16px' p='12px' bg={doneBg}
                  borderRadius='12px' border='1px solid' borderColor='orange.200'>
                  <Flex align='center' gap='8px'>
                    <Icon as={MdLock} color='orange.500' w='16px' h='16px' />
                    <Text color='orange.700' fontSize='sm' fontWeight='600'>
                      Awaiting admin review
                    </Text>
                  </Flex>
                  <Text color='orange.600' fontSize='sm' mt='4px'>
                    All steps done! Review takes 1-24 hours.
                  </Text>
                </Box>
              )}
            </PageCard>
          </Box>

          {/* Right — Active step form */}
          <Box flex='1'>
            <PageCard p='0' overflow='hidden'>
              {/* Step header */}
              <Box
                p='20px'
                bg={isStepDone(currentStep.stageKey) ? doneBg : activeBg}
                borderBottom='1px solid' borderColor={borderColor}>
                <Flex align='center' gap='12px'>
                  <Box
                    w='44px' h='44px' borderRadius='12px'
                    bg={currentStep.bg}
                    display='flex' alignItems='center' justifyContent='center'>
                    <Icon
                      as={isStepDone(currentStep.stageKey) ? MdCheckCircle : currentStep.icon}
                      color={isStepDone(currentStep.stageKey) ? 'green.500' : currentStep.color}
                      w='22px' h='22px'
                    />
                  </Box>
                  <Box flex='1'>
                    <Flex align='center' gap='8px'>
                      <Text color={textColor} fontSize='md' fontWeight='800'>
                        Step {currentStep.id} — {currentStep.label}
                      </Text>
                      {isStepDone(currentStep.stageKey) && (
                        <Badge colorScheme='green' borderRadius='full' fontSize='10px'>
                          Completed
                        </Badge>
                      )}
                    </Flex>
                    <Text color={subColor} fontSize='base' mt='2px'>
                      {currentStep.desc}
                    </Text>
                  </Box>
                  {/* Next step button */}
                  {activeStep < STEPS.length - 1 && (
                    <Button
                      size='sm' variant='ghost' color='brand.500'
                      rightIcon={<Icon as={MdArrowForward} />}
                      onClick={() => setActiveStep(activeStep + 1)}>
                      Next
                    </Button>
                  )}
                </Flex>
              </Box>

              {/* Step form */}
              <Box p='24px'>
                {getStepForm(currentStep.id)}
              </Box>

              {/* Bottom navigation */}
              <Divider borderColor={borderColor} />
              <Flex justify='space-between' align='center' p='16px'>
                <Button
                  size='sm' variant='ghost' color={subColor}
                  isDisabled={activeStep === 0}
                  onClick={() => setActiveStep(activeStep - 1)}>
                  ← Previous
                </Button>
                <Text color={subColor} fontSize='sm'>
                  Step {activeStep + 1} of {STEPS.length}
                </Text>
                <Button
                  size='sm' bg='brand.500' color='white'
                  borderRadius='10px'
                  isDisabled={activeStep === STEPS.length - 1}
                  _hover={{ bg: 'brand.600' }}
                  onClick={() => setActiveStep(activeStep + 1)}>
                  Next Step →
                </Button>
              </Flex>
            </PageCard>
          </Box>
        </Flex>
      )}
    </PageLayout>
  );
}