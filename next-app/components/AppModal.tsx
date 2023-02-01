import {
  chakra,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
} from "@chakra-ui/react";
import { ReactNode } from "react";
import { mainBG } from "../constants/colours";
import BackButton from "./Menu/BackButton";

interface IAppModal {
  content: ReactNode | ReactNode[];
  title: string;
  isOpen: boolean;
  closeFunction: () => void;
}

/**
 * Common component used for modals throughout the application
 * @param content The content of the modal
 * @param title The title that is displayed in the modal
 * @param isOpen The boolean that represents whether the modal is open or not
 * @param closeFunction The function that will close the modal
 */
const AppModal = ({ content, title, isOpen, closeFunction }: IAppModal) => {
  return (
    <>
      <Modal onClose={closeFunction} isOpen={isOpen}>
        <ModalOverlay />
        <ModalContent
          position="relative"
          bgGradient={mainBG}
          borderRadius="10px"
          alignItems="center"
          padding="5px"
        >
          <BackButton action={closeFunction} />
          <ModalHeader>
            {/* @ts-ignore */}
            <TitleText>{title}</TitleText>
          </ModalHeader>
          <ModalBody w="100%">{content}</ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

const TitleText = chakra(Text, {
  baseStyle: {
    color: "white",
    fontSize: "20px",
    fontWeight: "bold",
    textAlign: "center",
    fontFamily: "Play",
  },
});

export default AppModal;
