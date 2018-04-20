import React from 'react';

import styles from './Pods.css';
import Pod from './Pod/Pod';
import AddPod from './AddPod/AddPod';

const pods = (props) => {
  let pods = null;

  if (props.pods.length) {
    pods = props.pods
      .sort((a, b) => {
        return a.id - b.id;
      })
      .map((pod) => {
        return (
          <Pod
            key={pod.id}
            pod={pod}
            clicked={props.podClicked}
            activePod={props.activePod}
          />
        );
      });

  }
  
  return (
    <div className={styles.Pods}>
      {pods}
      <AddPod 
        openModal={props.openCreateJoinModal}
      />
    </div>
  );
};

export default pods;
