
import { useState } from 'react';
import { Icon } from '@chakra-ui/react';
import { MdOutlineRemoveRedEye } from 'react-icons/md';
import { RiEyeCloseLine } from 'react-icons/ri';

export const usePasswordToggle = () => {
  const [show, setShow] = useState(false);

  const ToggleIcon = (
    <Icon
      color='gray.400'
      _hover={{ cursor: 'pointer', color: 'brand.500' }}
      as={show ? RiEyeCloseLine : MdOutlineRemoveRedEye}
      onClick={() => setShow(!show)}
    />
  );

  return { show, setShow, ToggleIcon };
};