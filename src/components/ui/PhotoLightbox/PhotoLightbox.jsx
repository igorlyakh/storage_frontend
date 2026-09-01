import { Image, Modal } from '@mantine/core';

const PhotoLightbox = ({ src, onClose }) => (
  <Modal
    opened={!!src}
    onClose={onClose}
    centered
    size="auto"
    padding={0}
    withCloseButton={false}
  >
    {src && (
      <Image
        src={src}
        fit="contain"
        mah="85vh"
        onClick={onClose}
        style={{ cursor: 'zoom-out', display: 'block' }}
      />
    )}
  </Modal>
);

export default PhotoLightbox;
