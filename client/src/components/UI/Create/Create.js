import React, { Component } from 'react';
import { connect } from 'react-redux';
import Dropzone from 'react-dropzone';
import upload from 'superagent';

import styles from './Create.css';
import LeftArrow from 'react-icons/lib/io/android-arrow-back';
import ChooseCategory from '../ChooseCategory/ChooseCategory';
import * as actions from '../../../store/actions/index';

class Create extends Component {
	state = {
		files: [],
		showModal: false,
		podName: '',
		podNameError: {
			error: false,
			message: '',
		},
		category: '',
		categoryError: {
			error: false,
			message: '',
		},
		description: '',
		descriptionError: {
			error: false,
			message: '',
		},
		avatar: '',
		avatarError: {
			error: false,
			message: '',
		}
	};

	onDrop = (files) => {
		this.setState({
			files: files
		})
		let image = files[0];
		let uploadedImage = null;
		upload.post('/upload')
		.attach('image', image)
		.end((err, res) => {
			if (err) console.log(err);
			uploadedImage = res.text;
			this.setState({
				avatar: uploadedImage
			})
		})

	}

	changeCategory = event => {
		this.setState({ category: event.target.value })
	}

	validate = () => {
		let isError = false;
		if (this.state.podName.length < 4) {
			isError = true;
			this.setState({
				podNameError: {
					error: true,
					message: 'Pod name needs to be at least 4 characters long',
				},
			});
		}

		if (this.state.podName.includes(' ')) {
			isError = true;
			this.setState({
				podNameError: {
					error: true,
					message: 'Pod name must not contain any spaces',
				},
			});
		}

		if (this.state.category === '') {
			isError = true;
			this.setState({
				categoryError: {
					error: true,
					message: 'Please select a category',
				},
			});
		}

		if (this.state.description.split(' ').length < 5) {
			isError = true;
			this.setState({
				descriptionError: {
					error: true,
					message: 'Description must be at least 5 words long.',
				},
			});
		}

		return isError;
	};

	onSubmit = event => {
		event.preventDefault();
		//check for errors
		this.setState({
			podNameError: {
				error: false,
				message: '',
			},
			categoryError: {
				error: false,
				message: '',
			},
			descriptionError: {
				error: false,
				message: '',
			},
		});
		const err = this.validate();
		if (err) {
			this.setState({
				podName: '',
				category: '',
				description: '',
			});
		} else {
			this.props.createPod(
				this.state.podName,
				this.state.category,
				this.state.description,
				this.state.avatar
			);

			this.props.onRequestClose();
		}
	};

	handleChange = event => {
		this.setState({ [event.target.name]: event.target.value });
	};

	render() {

		if (this.state.showModal) {
			return <ChooseCategory chooseCategory={this.chooseCategory} />;
		}

		let category = 'Select a category';
		if (this.state.category !== '') {
			category = this.state.category;
		}

		let avatar = '';
		if (this.state.podName !== '') {
			avatar = this.state.podName.charAt(0).toUpperCase();
		}

		let categories = this.props.categories.map(category => {
			return <option key={category.id} className={styles.DropdownValue} value={category.id}>{category.name}</option>
		})

		return <form onSubmit={this.onSubmit} className={styles.Create}>
				<div className={styles.Header}>CREATE A POD</div>
				<div className={styles.PodInfo}>
					<div className={styles.PodLeft}>
						<div>
							<label>NAME</label>
							<div className={styles.PodForm}>
								<input className={styles.PodInputForm} type="text" autoFocus="autofocus" placeholder="Enter a pod name here" name="podName" value={this.state.podName} onChange={this.handleChange} />
								{this.state.podNameError.error ? <div className={styles.ErrorMessage}>
										{this.state.podNameError.message}
									</div> : null}
							</div>
						</div>
						<div>
							<label>CATEGORY</label>
							<div className={styles.PodCategoryContainer}>
								<select className={styles.PodCategory} onChange={this.changeCategory}>
									<option value="" disabled selected hidden>
										Select a category
									</option>
									{categories}
								</select>
							</div>
							{this.state.categoryError.error ? <div className={styles.ErrorMessage}>
									{this.state.categoryError.message}
								</div> : null}
						</div>
						<div>
							<label>DESCRIPTION</label>
							<input className={styles.DescriptionInputForm} type="text" placeholder="Enter a description here" name="description" value={this.state.description} onChange={this.handleChange} />
							{this.state.descriptionError.error ? <div className={styles.ErrorMessage}>
									{this.state.descriptionError.message}
								</div> : null}
						</div>
					</div>
					<div>
						<Dropzone accept="image/*" className={styles.Avatar} onDrop={this.onDrop.bind(this)}>
							{this.state.files.length > 0 ? <img className={styles.Image} src={this.state.files[0].preview}/> : avatar}
						</Dropzone>
						<br/>
						<div className={styles.UploadText}>Click to upload image</div>
						{/* {avatar} */}
					</div>
				</div>
				<div className={styles.Footer}>
					<div onClick={this.props.closeModal} className={styles.BackButton}>
						<LeftArrow className={styles.BackIcon} />
						Back
					</div>
					<button type="submit" className={styles.CreateButton}>
						Create
					</button>
				</div>
			</form>;
	}
}

const mapStateToProps = state => {
	return {
		// categories: state.chat.categories
	};
};

const mapDispatchToProps = dispatch => {
	return {
		createPod: (podName, category, description, avatar) => dispatch(actions.createPod(podName, category, description, avatar)),
		// fetchCategories: () => dispatch(actions.fetchCategories())
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(Create);
