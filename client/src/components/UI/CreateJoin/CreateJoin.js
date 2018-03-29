import React, { Component } from 'react';
import { connect } from 'react-redux';

import styles from './CreateJoin.css';
import Create from '../Create/Create';
import PodContainer from '../../Chat/ChatView/PodContainer/PodContainer';
import DiscoverCategoriesContainer from '../../Chat/ChatView/DiscoverCategoriesContainer/DiscoverCategoriesContainer';
import DiscoverContainer from '../../Chat/ChatView/DiscoverContainer/DiscoverContainer';
import * as actions from '../../../store/actions/index';

class createJoin extends Component {
  state = {
    showCreate: false
  }

  componentDidMount() {

  }

  closeCreate = () => {
    this.setState({ showCreate: false });
  }

  createClick = () => {
    this.setState({ showCreate: true });
  }

  handleJoinClick = () => {
    this.props.discoverClicked();
    this.props.closeModal();
  }

  render() {
    if (this.state.showCreate) {
      return <Create onRequestClose={this.props.closeModal} closeModal={this.closeCreate.bind(this)}/>;
    }

    return (
      <div className={styles.CreateJoin}>
        <div className={styles.Create} onClick={this.createClick}>
          CREATE POD
        </div>
        <div
          className={styles.Join}
          onClick={this.handleJoinClick}>
          JOIN POD
        </div>
      </div>
    );
  }
};

const mapStateToProps = state => {
  return {};
};

const mapDispatchToProps = dispatch => {
  return {
      discoverClicked: () => dispatch(actions.discoverClicked()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(createJoin);
