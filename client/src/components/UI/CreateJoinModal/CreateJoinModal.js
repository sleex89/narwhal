import React from 'react';
import Modal from 'react-modal';

import styles from './CreateJoinModal.css';
import CreateJoin from '../CreateJoin/CreateJoin';

Modal.setAppElement('#root');

const createJoinModal = (props) => {
  return (
    <div>
      <Modal
        className={styles.Modal}
        overlayClassName={styles.Overlay}
        isOpen={props.isOpen}
        onRequestClose={props.onRequestClose}
        shouldCloseOnOverlayClick={true} 
        >
        <CreateJoin closeModal={props.onRequestClose}/>
      </Modal>
    </div>
  );
}

export default createJoinModal;