import React, { Component } from 'react';
import { connect } from 'react-redux';

import Button from '../../../components/UI/Button/Button'
import './Signup.css'
import Input from '../../../components/UI/Input/Input'
import * as actions from '../../../store/actions/index'
import LogoAuth from '../LogoAuth/LogoAuth'
import { NavLink } from 'react-router-dom';

class Signup extends Component {
	state = {
		//Form input fields
		controls: {
			username: {
				elementType: 'input',
				elementConfig: {
					type: 'username',
					placeholder: 'Username',
				},
				value: '',
				validation: {
					required: true,
				},
				valid: false,
				touched: false,
			},
			email: {
				elementType: 'input',
				elementConfig: {
					type: 'email',
					placeholder: 'E-mail Address',
				},
				value: '',
				validation: {
					required: true,
					isEmail: true,
				},
				valid: false,
				touched: false,
			},
			password: {
				elementType: 'input',
				elementConfig: {
					type: 'password',
					placeholder: 'Password',
				},
				value: '',
				validation: {
					required: true,
					minLength: 6,
				},
				valid: false,
				touched: false,
			},
		},
		isSignup: true,
	};

	componentDidMount() {
		console.log('this.props in signup', this.props)
	}

	submitHandler = event => {
		event.preventDefault();
		this.props.onAuth(this.state.controls.email.value, this.state.controls.password.value, this.state.controls.username.value, this.state.isSignup);
    };
    
	//updating the form fields for each input form.
	inputChangedHandler = (event, controlName) => {
		const updatedControl = {
			...this.state.controls,
			[controlName]: {
				...this.state.controls[controlName],
				value: event.target.value,
				valid: this.checkValidity(event.target.value, this.state.controls[controlName].validation),
				touched: true,
			},
		};
		this.setState({ controls: updatedControl });
    };
    

	switchAuthModeHandler = () => {
		this.setState(prevState => {
			return { isSignup: !prevState.isSignup };
		});
	};

	//Making sure that the form has valid rules for username, password and email
	checkValidity = (value, rules) => {
		let isValid = true;
		if (!rules) {
			return true;
		}

		if (rules.required) {
			isValid = value.trim() !== '' && isValid;
		}

		if (rules.minLength) {
			isValid = value.length >= rules.minLength && isValid;
		}

		if (rules.maxLength) {
			isValid = value.length <= rules.maxLength && isValid;
		}

		if (rules.isEmail) {
			const pattern = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
			isValid = pattern.test(value) && isValid;
		}

		if (rules.isNumeric) {
			const pattern = /^\d+$/;
			isValid = pattern.test(value) && isValid;
		}

		return isValid;
	};

	render() {
		const formElementsArray = [];
		for (let key in this.state.controls) {
			formElementsArray.push({
				id: key,
				config: this.state.controls[key],
			});
		}

		let form = formElementsArray.map(formElement => (
			<Input
				key={formElement.id}
				elementType={formElement.config.elementType}
				elementConfig={formElement.config.elementConfig}
				value={formElement.config.value}
				invalid={!formElement.config.valid}
				shouldValidate={formElement.config.validation}
				touched={formElement.config.touched}
				changed={event => this.inputChangedHandler(event, formElement.id)}
			/>
		));

		let errorMessage = null;

		if (this.props.error) {
			errorMessage = <p>{this.props.error.message}</p>;
		}

		return (
			<div className="authContainer">
				<div className="signUp">
					{errorMessage}
					<form className="signupForm" onSubmit={this.submitHandler}>
						<p className="authHeader">CREATE AN ACCOUNT</p>
						{form}
						<Button btnType="Success">CONTINUE</Button>
						<p> Already have an account? <NavLink to='/login'>Login</NavLink></p>
					</form>
					{/* <Button clicked={this.switchAuthModeHandler} btnType="Danger">
						SWITCH TO {this.state.isSignup ? 'SIGNIN' : 'SIGNUP'}
					</Button> */}
				</div>
				<div className="logo">
					<LogoAuth />
				</div>
			</div>
		);
	}
}

const mapStateToProps = state => {
	console.log('mapstatetoprops state', state)
    return {
		error: state.auth.error,
		token: state.auth.token
    };
}

const mapDispatchToProps = dispatch => {
    return {
        onAuth: (email, password, username, isSignup) => dispatch(actions.auth(email, password, username, isSignup))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Signup);