import React, { Component } from 'react';
import './App.css';
import './bootstrap-4.0.0-beta.2-dist/css/bootstrap.css'
import { Input } from './components/Input'
import { Apis } from './components/Apis'
import { Method } from './components/Method'
import { Diff } from './components/Diff'
import { Footer } from './components/Footer'
import { sendReq } from './components/Request'
import jdd from './libs/jdd'
import jsonlint from 'jsonlint-mod'

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
    endpoint: "/schedule/f0058a00-5ced-4d11-ad64-bc6b9c091595/popular?user_id=211f2f08-fbab-46a6-a36a-c92c648673af",
    token: "8PNaZU0PIOt1b1cRfkPAvd85B0I9G01KkTof7Gy1",
    v2Copied: "Copy Curl",
    v3Copied: "Copy Curl",
    v2JsonCopied: "JSON",
    v3JsonCopied: "JSON",
    method: "GET",
    stage: "Alessio",
    v2Res: "",
    v3Res: "",
    v2ResStatus: "",
    v3ResStatus: "",
    show: false,
    compared: false,
    v2Config: null,
    v3Config: null,
    parseError: {
      msg: "",
      line: "",
      side: ""
    },
    diffLines: "",
    report: ""
  }

  componentDidMount() {
    // Check if query params can be parsed (for request coming from slack)
    const uri = window.location.href
    const url = uri.slice(uri.indexOf("?") + 1)
    if (url === uri) {
      return
    }
    const endpoint = url.slice((url.indexOf("endpoint") + 9), url.indexOf("&token"))
    const token = url.slice(url.indexOf("token") + 6)
    this.setState({
      endpoint: endpoint,
      token: token
    })
    this.onSendReq("v2")
    this.onSendReq("v3")
    this.onShowDiffs()
    this.compareJSON()
  }

  // Update text in input fields
  onChangeInputField = (event) => {
    const input = event.target.name
    const text = event.target.value.trim()
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

  // Clear data when click in the inputs fields
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

  // Copy JSON to clipboard
  copyToClipboard = (text) => {
    const textField = document.createElement('textarea')
    textField.innerText = text
    document.body.appendChild(textField)
    textField.select()
    document.execCommand('copy')
    textField.remove()
  }

  // Copy to clipboard
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

  // Send http request to api
  onSendReq = (req) => {
    const { v2Url, v3Url, endpoint, token } = this.state
    if (req === "v2") {
      const url = v2Url + endpoint
      sendReq({ url, token })
        .then(result => {
          // create config for v2 result
          const v2Config = jdd.createConfig();
          jdd.formatAndDecorate(v2Config, result);
          this.setState({
            v2Res: v2Config.out,
          })
        })
        .catch(error => {
          if (error.response === undefined) {
            console.log(error.request)
            return
          }
          this.setState({
            v2Res: error,
            v2ResStatus: error.response.status,
            v2JsonCopied: error.response.status
          })
        })
    } else {
      const url = v3Url + endpoint
      sendReq({ url, token })
        .then(result => {
          // create config for v3 result
          const v3Config = jdd.createConfig();
          jdd.formatAndDecorate(v3Config, result);
          this.setState({
            v3Res: v3Config.out,
          })
        })
        .catch(error => {
          if (error.response === undefined) {
            console.log(error.request)
            return
          }
          this.setState({
            v3Res: error,
            v3ResStatus: error.response.status,
            v3JsonCopied: error.response.status
          })
        })
    }
  }

  // Copy JSON response to clipboard
  onCopyRes = (res) => {
    const { v2Res, v3Res } = this.state
    this.setState({
      v2JsonCopied: "JSON",
      v3JsonCopied: "JSON"
    })
    if (res === "v2") {
      this.copyToClipboard(v2Res)
      this.setState({ v2JsonCopied: "Copied!" })
    } else {
      this.copyToClipboard(v3Res)
      this.setState({ v3JsonCopied: "Copied!" })
    }
  }

  // Change value of method and stage
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

  // Update res in textarea
  onUpdateRes = (event) => {
    const ta = event.target.id
    const input = event.target.value
    console.log(input)
    if (ta === "textarealeft") {
      this.validateJSON(input, "left")
      this.setState({
        v2Res: input
      })
    } else {
      this.validateJSON(input, "right")
      this.setState({
        v3Res: input
      })

    }
  }

  // Show/Hide comparison
  onShowDiffs = () => {
    this.setState({ show: !this.state.show })
  }

  // Call compareJSON and change compare button layout
  onCompare = () => {
    const { compared } = this.state
    if (compared === false) {
      if (this.compareJSON() === "invalid") { return }
      this.setState({ compared: true })
    } else {
      this.setState({ compared: false })

    }
  }

  // Validate the JSON input
  validateJSON = (input, side) => {
    try {
      let parsedInput = jsonlint.parse(input)
      // if no parsing errors reset parsing errors
      this.setState({ parseError: {} })
      return parsedInput
    } catch (e) {
      let msg = e.message
      msg = msg.substring(0, msg.indexOf(":"))
      if (msg.indexOf("Parse error") !== -1) {
        let line = msg.substring((msg.indexOf("line") + 5))
        this.setState({
          parseError: {
            msg: msg,
            line: line,
            side: side
          }
        })
      }
      return false
    }
  }

  // CompareJSON logic
  compareJSON = () => {
    const { v2Res, v3Res } = this.state
    // create config
    let v2Raw, v3Raw
    v2Raw = this.validateJSON(v2Res, "left")
    v3Raw = this.validateJSON(v3Res, "right")
    if (v2Raw === false || v3Raw === false) {
      return "invalid"
    }

    const v2Config = jdd.createConfig();
    jdd.formatAndDecorate(v2Config, v2Raw); // TODO: add catch for bad JSON
    const v3Config = jdd.createConfig();
    jdd.formatAndDecorate(v3Config, v3Raw); // TODO: add catch for bad JSON

    // Find differences values and store them in jdd.diffs
    jdd.diffs = []
    jdd.diffVal(v2Raw, v2Config, v3Raw, v3Config);

    // Store the error lines
    const diffLines = []
    jdd.diffs.map(diff => diffLines.push(diff.path1.line))
    const diffNum = diffLines.length
    let report;
    if (diffNum === 0) {
      report = "Yey! No differences found!"
    } else {
      report = `Found ${diffNum} ${diffNum > 1 ? "differences" : "difference"}.`
    }
    this.setState({
      diffLines: diffLines,
      report: report
    })
  }

  render() {
    const {
      method,
      v2Url,
      v3Url,
      endpoint,
      token,
      v2Copied,
      v3Copied,
      v2JsonCopied,
      v3JsonCopied,
      v2Res,
      v3Res,
      v2ResStatus,
      v3ResStatus,
      show,
      btnCompText,
      compared,
      parseError,
      diffLines,
      report
    } = this.state

    return (
      <div className="App" >
        <div className="jumbotron">
          <h1 className="title">Migration Testing</h1>
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
        <br />
        <Diff
          showDiffs={this.onShowDiffs}
          show={show}
          v2Res={v2Res}
          v3Res={v3Res}
          onCompare={this.onCompare}
          onUpdateRes={this.onUpdateRes}
          btnCompText={btnCompText}
          compared={compared}
          leftErr={parseError.side === "left" && parseError.msg}
          rightErr={parseError.side === "right" && parseError.msg}
          idxErrLeft={parseError.side === "left" && parseError.line}
          idxErrRight={parseError.side === "right" && parseError.line}
          diffLines={diffLines}
          report={report}
        />
        <Footer />
      </div>
    );
  }
}

export default App;
