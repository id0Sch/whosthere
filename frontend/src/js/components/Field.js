import React, { Component } from 'react'
import TextField from 'material-ui/TextField'

class Field extends Component {
  constructor () {
    super()
    this.setValue = this.setValue.bind(this)
    this.getValue = this.getValue.bind(this)

    this.state = {
      value: null
    }
  }

  componentWillMount () {
    const {props} = this
    if (props.value) {
      this.setValue(props.value)
    }
  }
  componentWillReceiveProps (nextProps) {
    if (nextProps.value !== this.state.value) {
      this.setValue(nextProps.value)
    }
  }

  setValue (value) {
    this.setState({value})
  }

  getValue () {
    return this.state.value
  }

  render () {
    const {props, state} = this

    const {inputStyle, style, floatingLabelText, hintText, errorText, disabled, fullWidth, onChange, type} = props
    const {value} = state

    return <TextField
      type={type}
      inputStyle={inputStyle}
      name={floatingLabelText}
      disabled={disabled}
      fullWidth={fullWidth}
      errorText={errorText}
      hintText={hintText}
      underlineFocusStyle={inputStyle}
      value={value || props.value || ''}
      style={style}
      floatingLabelText={floatingLabelText}
      onChange={(event, newValue) => {
        this.setValue(newValue)
        onChange && onChange()
      }}
    />
  }
}

export default Field
