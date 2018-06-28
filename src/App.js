import './App.css';
import './bootstrap-4.0.0-beta.2-dist/css/bootstrap.css'

import jsonlint from 'jsonlint-mod'
import React, { Component } from 'react';

import { Apis } from './components/Apis'
import { Diff } from './components/Diff'
import { Footer } from './components/Footer'
import { Input } from './components/Input'
import { Method } from './components/Method'
import { sendReq } from './components/Request'
import jdd from './libs/jdd'

const stages = {
  "PG_1": [
    process.env.REACT_APP_V2_PG_1,
    process.env.REACT_APP_V3_PG_2
  ],
  "PG_2": [
    process.env.REACT_APP_V2_PG_2,
    process.env.REACT_APP_V3_PG_2
  ],
  "STG": [
    process.env.REACT_APP_V2_STG,
    process.env.REACT_APP_V3_PG_2
  ],
}

class App extends Component {
  state = {
    v2Url: process.env.REACT_APP_V2_PG_2,
    v3Url: process.env.REACT_APP_V3_PG_2,
    endpoint: '',
    token: '',
    v2Copied: 'Copy Curl',
    v3Copied: 'Copy Curl',
    v2JsonCopied: 'JSON',
    v3JsonCopied: 'JSON',
    method: 'GET',
    stageEnvs: [
      "PG_1",
      "PG_2",
      "STG"
    ],
    stage: 'PG_2',
    v2Res: '',
    v3Res: '',
    v2ResJson: '',
    v3ResJson: '',
    show: false,
    compared: false,
    v2Config: null,
    v3Config: null,
    parseError: { msg: '', line: '', side: '' },
    diffLinesL: null,
    diffLinesR: null,
    diffNum: 0,
    report: ''
  }

  componentDidMount() {
    // Check if query params can be parsed (for request coming from slack)
    const uri = window.location.href
    const url = uri.slice(uri.indexOf('?') + 1)
    if (url === uri) return

    const endpoint = url.slice((url.indexOf('endpoint') + 9), url.indexOf('&token'))
    const token = url.slice(url.indexOf('token') + 6, url.indexOf('token') + 46)
    const stage = url.slice(url.indexOf('stage') + 6).toUpperCase().replace("-", "_")
    console.log(stage)

    this.setState({
      endpoint: endpoint,
      token: token,
      stage: stage,
      v2Url: stages[stage][0],
      v3Url: stages[stage][1]
    }, function () {
      Promise.all([this.onSendReq('v2'), this.onSendReq('v3')])
        .then(() => {
          this.setState({
            show: !this.state.show
          }, this.onCompare())
        })
    })
  }

  // Reset buttons text to default
  resetButtons = (api) => {
    if (api === 'v2') {
      this.setState({
        v2Copied: 'Copy Curl',
        v2JsonCopied: 'JSON',
        v2Res: ''
      })
    } else if (api === 'v3') {
      this.setState({
        v3Copied: 'Copy Curl',
        v3JsonCopied: 'JSON',
        v3Res: ''
      })
    } else {
      this.setState({
        v2Copied: 'Copy Curl',
        v2JsonCopied: 'JSON',
        v2Res: '',
        v3Copied: 'Copy Curl',
        v3JsonCopied: 'JSON',
        v3Res: ''
      })
    }
  }

  // Update text in input fields
  onChangeInputField = (event) => {
    const input = event.target.name
    const text = event.target.value.trim()

    input === 'endpoint' ?
      (this.setState({ endpoint: text }))
      : (this.setState({ token: text }))
  }

  // Clear data when click in the inputs fields
  onClearInput = (event) => {
    const input = event.target
    if (input.name === 'endpoint') {
      this.setState({
        endpoint: '',
        v2Copied: 'Copy Curl',
        v3Copied: 'Copy Curl',
        v2JsonCopied: 'JSON',
        v3JsonCopied: 'JSON',
        v2Res: '',
        v3Res: ''
      })
    } else {
      this.setState({
        token: '',
        v2Copied: 'Copy Curl',
        v3Copied: 'Copy Curl',
        v2JsonCopied: 'JSON',
        v3JsonCopied: 'JSON',
        v2Res: '',
        v3Res: ''
      })
    }
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
    const field = document.getElementById(itemId)
    const text = field.textContent
    this.copyToClipboard(text)
    if (itemId === 'v2') {
      this.setState({
        v2Copied: 'Copied!',
        v3Copied: 'Copy'
      })
    } else {
      this.setState({
        v3Copied: 'Copied!',
        v2Copied: 'Copy'
      })
    }
  }

  // Send http request to api
  onSendReq = (req) => {
    return new Promise((resolve, reject) => {
      const { v2Url, v3Url, endpoint, token } = this.state

      if (req === 'v2') {
        this.resetButtons('v2')
        const url = v2Url + endpoint

        sendReq({ url, token })
          .then(result => {
            // create config for v2 result
            const v2Config = jdd.createConfig();
            jdd.formatAndDecorate(v2Config, result);
            this.setState({
              v2ResJson: JSON.stringify(result),
              v2Res: v2Config.out
            })
            resolve('Success')
          })
          .catch(error => {
            if (!error.status) {
              let eMsg
              if (error.message.indexOf('code') !== -1) {
                let idx = error.message.indexOf('code') + 5
                eMsg = error.message.slice(idx, (idx + 3))
              } else {
                eMsg = "404"
              }
              this.setState({
                v2Res: error,
                v2JsonCopied: eMsg
              })
              return
            }
            this.setState({
              v2Res: error,
              v2JsonCopied: error.response.status
            })
          })
      } else {
        const url = v3Url + endpoint
        this.resetButtons('v3')

        sendReq({ url, token })
          .then(result => {
            // create config for v3 result
            const v3Config = jdd.createConfig();
            jdd.formatAndDecorate(v3Config, result);
            this.setState({
              v3ResJson: JSON.stringify(result),
              v3Res: v3Config.out
            })
            resolve('Success')
          })
          .catch(error => {
            if (!error.status) {
              let eMsg
              if (error.message.indexOf('code') !== -1) {
                let idx = error.message.indexOf('code') + 5
                eMsg = error.message.slice(idx, (idx + 3))
              } else {
                eMsg = "404"
              }
              this.setState({
                v3Res: error,
                v3JsonCopied: eMsg
              })
              return
            }
            this.setState({
              v3Res: error,
              v3JsonCopied: error.response.status
            })
          })
      }
    })
  }

  // Copy JSON response to clipboard
  onCopyRes = (api, res) => {
    if (api === 'v2') {
      this.copyToClipboard(res)
      this.setState({
        v2JsonCopied: 'Copied!',
        v3JsonCopied: 'JSON'
      })
    } else {
      this.copyToClipboard(res)
      this.setState({
        v3JsonCopied: 'Copied!',
        v2JsonCopied: 'JSON'
      })
    }
  }

  // Change value of method and stage
  onChangeValue = (event) => {
    const id = event.target.id
    const input = event.target.value
    console.log(input)
    this.resetButtons("all")
    if (id === 'method') {
      this.setState({
        method: input
      })
    } else {
      this.setState({
        stage: input,
        v2Url: stages[input][0],
        v3Url: stages[input][1]
      })
    }
  }

  // Update res in textarea
  onUpdateRes = (event) => {
    const ta = event.target.id
    const input = event.target.value
    if (ta === 'textarealeft') {
      this.validateJSON(input, 'left')
      this.setState({
        v2Res: input
      })
    } else {
      this.validateJSON(input, 'right')
      this.setState({
        v3Res: input
      })
    }
  }

  // Show/Hide comparison
  onShowDiffs = () => {
    this.setState({
      show: !this.state.show
    })
  }

  // Call compareJSON and change compare button layout
  onCompare = () => {
    const { compared } = this.state
    if (compared === false) {
      if (this.compareJSON() === 'invalid') {
        return
      }
      this.setState({
        compared: true
      })
    } else {
      this.setState({
        compared: false
      })
    }
  }

  // Validate the JSON input
  validateJSON = (input, side) => {
    try {
      let parsedInput = jsonlint.parse(input)
      // if no parsing errors reset parsing errors
      this.setState({
        parseError: {}
      })
      return parsedInput
    } catch (e) {
      let msg = e.message
      msg = msg.substring(0, msg.indexOf(':'))
      if (msg.indexOf('Parse error') !== -1) {
        let line = msg.substring((msg.indexOf('line') + 5))
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
    // validate the json input
    let v2Raw, v3Raw
    v2Raw = this.validateJSON(v2Res, 'left')
    if (v2Raw === false) {
      return 'invalid'
    }
    v3Raw = this.validateJSON(v3Res, 'right')
    if (v3Raw === false) {
      return 'invalid'
    }

    // create config
    const v2Config = jdd.createConfig();
    jdd.formatAndDecorate(v2Config, v2Raw);
    const v3Config = jdd.createConfig();
    jdd.formatAndDecorate(v3Config, v3Raw);

    // Find differences values and store them in jdd.diffs
    jdd.diffs = []
    jdd.diffVal(v2Raw, v2Config, v3Raw, v3Config);

    // Store the error lines and type
    let itemsL = v2Res.split('\n').length - 1
    let itemsR = v3Res.split('\n').length - 1

    const diffLinesL = new Array(itemsL)
    const diffLinesR = new Array(itemsR)
    let diffNum = 0

    jdd.diffs.map(diff => {
      diffNum++
      diffLinesL[diff.path1.line] = diff.type
      diffLinesR[diff.path2.line] = diff.type
    })

    // Write report
    let report;
    if (diffNum === 0) {
      report = 'Yey! No differences found!'
    } else {
      report = `Found ${diffNum} ${diffNum > 1 ? 'differences' : 'difference'}.`
    }
    this.setState({
      diffLinesL: diffLinesL,
      diffLinesR: diffLinesR,
      diffNum: diffNum,
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
      show,
      btnCompText,
      compared,
      parseError,
      diffLinesL,
      diffLinesR,
      report,
      diffNum,
      v2ResJson,
      v3ResJson,
      stageEnvs,
      stage
    } = this.state

    return (
      <div className='App'>
        <div className='jumbotron'>
          <h1 className='title'>Migration Testing</h1>
          <br />
          <Method
            onChangeValue={this.onChangeValue}
            stages={stageEnvs}
            currentStage={stage}
          />
          <br />
          <Input
            label='Endpoint'
            name='endpoint'
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
          v2ResJson={v2ResJson}
          v3ResJson={v3ResJson}
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
          leftErr={parseError.side === 'left' && parseError.msg}
          rightErr={parseError.side === 'right' && parseError.msg}
          idxErrLeft={parseError.side === 'left' && parseError.line}
          idxErrRight={parseError.side === 'right' && parseError.line}
          diffLinesL={diffLinesL}
          diffLinesR={diffLinesR}
          report={report} diffNum={diffNum}
        />
        <Footer />
      </div>
    )
  }
}

export default App;
