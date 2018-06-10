import React, { Component } from 'react';
import './App.css';
import './bootstrap-4.0.0-beta.2-dist/css/bootstrap.css'
import { Input } from './components/Input'
import { Apis } from './components/Apis'
import { Method } from './components/Method'
import { Footer } from './components/Footer'
import { sendReq } from './components/Request'

const stages = {
  Alessio: [
    process.env.REACT_APP_V2_ALESSIO,
    process.env.REACT_APP_V3_ALESSIO
  ],
  PG: [
    process.env.REACT_APP_V2_PG,
    process.env.REACT_APP_V3_PG
  ]
}

class App extends Component {
  state = {
    v2Url: process.env.REACT_APP_V2_ALESSIO,
    v3Url: process.env.REACT_APP_V3_ALESSIO,
    endpoint: "",
    token: "",
    v2Copied: "Copy Curl",
    v3Copied: "Copy Curl",
    v2JsonCopied: "JSON",
    v3JsonCopied: "JSON",
    method: "GET",
    stage: "Alessio",
    v2Res: "",
    v3Res: ""
  }

  componentDidMount() {
    const url = window.location.href
    const params = url.slice(url.indexOf("?") + 1).split("&")
    const endpoint = params[0].slice(params[0].indexOf("=") + 1)
    const token = params[1].slice(params[1].indexOf("=") + 1)
    this.setState({
      endpoint: endpoint,
      token: token
    })
  }

  // Update text in input boxes
  onChangeInputField = (event) => {
    const input = event.target.name
    const text = event.target.value
    this.setState(() => {
      if (input === "endpoint") {
        return {
          endpoint: text
        }
      } else {
        return {
          token: text
        }
      }
    })
  }

  // Clear data when click in the inputs boxes
  onClearInput = (event) => {
    const input = event.target
    this.setState({
      v2Copied: "Copy Curl",
      v3Copied: "Copy Curl",
      v2JsonCopied: "JSON",
      v3JsonCopied: "JSON",
      v2Res: "",
      v3Res: ""
    })
    this.setState(() => {
      if (input.name === "endpoint") {
        return {
          endpoint: ""
        }
      } else {
        return {
          token: ""
        }
      }
    })
  }

  copyToClipboard = (text) => {
    const textField = document.createElement('textarea')
    textField.innerText = text
    document.body.appendChild(textField)
    textField.select()
    document.execCommand('copy')
    textField.remove()
  }

  onCurlCopy = (itemId) => {
    this.setState({
      v2Copied: "Copy",
      v3Copied: "Copy"
    })
    const field = document.getElementById(itemId)
    const text = field.textContent
    this.copyToClipboard(text)
    if (itemId === "v2") {
      this.setState({ v2Copied: "Copied!" })
    } else {
      this.setState({ v3Copied: "Copied!" })
    }
  }

  onSendReq = (req) => {
    const { v2Url, v3Url, endpoint, token } = this.state
    if (req === "v2") {
      const url = v2Url + endpoint
      sendReq({ url, token })
        .then(result => {
          this.setState({ v2Res: JSON.stringify(result) })
        })
    } else {
      const url = v3Url + endpoint
      sendReq({ url, token })
        .then(result => {
          this.setState({ v3Res: JSON.stringify(result) })
        })
    }
  }

  onCopyRes = (res) => {
    const { v2Res, v3Res } = this.state
    this.setState({
      v2JsonCopied: "JSON",
      v3JsonCopied: "JSON"
    })
    if (res === "v2") {
      this.copyToClipboard(v2Res)
      this.setState({ v2JsonCopied: "Copied" })
    } else {
      this.copyToClipboard(v3Res)
      this.setState({ v3JsonCopied: "Copied" })
    }
  }

  onChangeValue = (event) => {
    const id = event.target.id
    const input = event.target.value
    if (id === "method") {
      this.setState({ method: input })
    } else {
      this.setState({ stage: input })
      const urls = (input === "Alessio" ? stages.Alessio : stages.PG)
      this.setState({
        v2Url: urls[0],
        v3Url: urls[1]
      })
    }
  }

  render() {
    const { method, v2Url, v3Url, endpoint, token, v2Copied, v3Copied, v2JsonCopied, v3JsonCopied, v2Res, v3Res } = this.state

    return (
      <div className="App" >
        <div className="jumbotron">
          <h1 className="title">OSS Endpoint Testing</h1>
          <br />
          <Method
            onChangeValue={this.onChangeValue}
          />
          <br />
          <Input
            label="Endpoint"
            name="endpoint"
            value={endpoint}
            onChangeField={this.onChangeInputField}
            onClearField={this.onClearInput}
          />
          <Input
            label="Token"
            name="token"
            value={token}
            onChangeField={this.onChangeInputField}
            onClearField={this.onClearInput}
          />
        </div>
        <br />
        <Apis
          method={method}
          v2Url={v2Url + endpoint}
          v3Url={v3Url + endpoint}
          token={token}
          onCopyCurl={this.onCurlCopy}
          onSendReq={this.onSendReq}
          onCopyRes={this.onCopyRes}
          btnTextV2={v2Copied}
          btnTextV3={v3Copied}
          btnJsonV2={v2JsonCopied}
          btnJsonV3={v3JsonCopied}
          v2Res={v2Res}
          v3Res={v3Res}
        />
        <Footer />
      </div>
    );
  }
}

export default App;
