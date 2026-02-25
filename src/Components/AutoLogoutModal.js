// src/components/AutoLogoutModal.jsx
import React from 'react';
import { Modal, ModalBody, ModalFooter, Button } from 'reactstrap';

export default function AutoLogoutModal({ visible, secondsLeft, onContinue, onCancel }) {
  return (
    <Modal isOpen={!!visible} backdrop="static" keyboard={false} centered>
      <div className="modal-header">
        <h5 className="modal-title">You will be logged out soon</h5>
      </div>
      <ModalBody>
        <p>
          You have been inactive. For security reasons, your session will be logged out in <strong>{secondsLeft}</strong> second{secondsLeft === 1 ? '' : 's'}.
        </p>
        <p>If you'd like to continue your session press <strong>Continue</strong>. Otherwise press <strong>Cancel</strong> to logout immediately.</p>
      </ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={onContinue}>Continue</Button>
        <Button color="secondary" onClick={onCancel}>Cancel</Button>
      </ModalFooter>
    </Modal>
  );
}