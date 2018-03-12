import { PureComponent, createElement } from 'react'
import { connect } from 'react-redux'
import hoistStatics from 'hoist-non-react-statics'
import {
  isPasswordRecoverLoading,
  isPasswordRecovered,
  getPasswordRecoverError,
} from '../selectors'
import {
  setPasswordRecoverEmail,
  recoverPassword,
  unloadPasswordRecover,
} from '../actions'

export default function withPasswordRecover() {
  return function wrapWithRecover(WrappedComponent) {
    class BaseRecover extends PureComponent {
      state = {
        recoverEmail: '',
      }

      componentWillUnmount() {
        this.props.unloadPasswordRecover()
      }

      onRecoverEmailChange = e => {
        this.setState({
          recoverEmail: e.target.value,
        })
      }

      onSubmitRecoverPassword = (e, ...args) => {
        if (e && typeof e.preventDefault === 'function') {
          e.preventDefault()
        }
        this.props.recoverPassword(this.state.recoverEmail, ...args)
      }

      render() {
        return createElement(WrappedComponent, {
          ...this.props,
          recoverEmail: this.state.recoverEmail,
          onRecoverEmailChange: this.onRecoverEmailChange,
          onSubmitRecoverPassword: this.onSubmitRecoverPassword,
        })
      }
    }

    const mapStateToProps = state => ({
      recoverError: getPasswordRecoverError(state),
      recoverLoading: isPasswordRecoverLoading(state),
      recovered: isPasswordRecovered(state),
    })
    const Recover = connect(mapStateToProps, {
      recoverPassword,
      unloadPasswordRecover,
    })(BaseRecover)

    return hoistStatics(Recover, WrappedComponent)
  }
}
