import './App.css'
import './bootstrap-4.0.0-beta.2-dist/css/bootstrap.css'

import jsonlint from 'jsonlint-mod'
import React, { Component } from 'react'

import { Apis } from './components/Apis'
import { Diff } from './components/Diff'
import { Footer } from './components/Footer'
import { ReqForm } from './components/ReqForm'
import { sendReq } from './components/Request'
import jdd from './libs/jdd'

class App extends Component {
  state = {
    left: {
      id: 'left',
      label: 'left',
      curlBtn: 'Copy Curl',
      jsonBtn: 'JSON',
      config: null,
      resp: '',
      respJson: ''
    },
    right: {
      id: 'right',
      label: 'right',
      curlBtn: 'Copy Curl',
      jsonBtn: 'JSON',
      config: null,
      resp: '',
      respJson: ''
    },
    method: 'GET',
    endpoint: '',
    token: '',
    env: '',
    pid: '',
    show: false,
    compared: false,
    parseError: { msg: '', line: '', side: '' },
    diffLinesL: null,
    diffLinesR: null,
    diffNum: 0,
    report: ''
  }

  fillFromParams() {
    const query = new URLSearchParams(window.location.search)
    if (query && query.has('base')) {
      const base = query.get('base')
      const hostBase = base.substr(base.indexOf('.') + 1)
      const endpoint = query.get('endpoint')
      const env = query.get('env')
      const pid = query.get('pid')

      let testing = ''
      endpoint.indexOf('?') === -1 ? (testing = '?testing=') : (testing += '&testing=')

      const left = this.state.left
      left.url = `${base}/v2${endpoint}${testing}`
      left.host = `${env}-v2-${hostBase}`
      left.pid = pid

      const right = this.state.right
      right.url = `${base}${endpoint}${testing}stage=${env}`
      right.host = `${query.get('v3host')}-v3-${hostBase}`
      right.pid = pid

      this.setState(
        {
          endpoint,
          env,
          pid,
          left,
          right
        },
        function () {
          Promise.all([this.onSendReq('left'), this.onSendReq('right')]).then(() => {
            this.setState({ show: !this.state.show }, this.onCompare())
          })
        }
      )
      return true
    }
    return false
  }

  componentDidMount() {
    // Check if it's a custom request coming from slack, otherwise retrieve last used fields
    if (!this.fillFromParams()) {
      const lastEndpoint = localStorage.getItem('endpoint')
      const lastToken = localStorage.getItem('token')

      this.setState({
        endpoint: lastEndpoint,
        token: lastToken
      })
    }
  }

  // Reset buttons text to default
  resetButtons = api => {
    this.setState(prevState => {
      const updateApi = {
        ...prevState[api],
        curlBtn: 'Copy Curl',
        jsonBtn: 'JSON',
        resp: ''
      }
      return ({
        [api]: updateApi
      })
    })
  }

  resetAllButtons() {
    this.resetButtons('left')
    this.resetButtons('right')
  }

  // Update text in input fields
  onChangeInputField = event => {
    const input = event.target.name
    const text = event.target.value.trim()

    localStorage.setItem(input, text)
    this.setState({ [input]: text })
  }

  // Clear data when click in the inputs fields
  onClearInput = event => {
    const input = event.target.name

    this.resetAllButtons()
    this.setState({ [input]: '' })
  }

  // Copy JSON to clipboard
  copyToClipboard = text => {
    const textField = document.createElement('textarea')
    textField.innerText = text
    document.body.appendChild(textField)
    textField.select()
    document.execCommand('copy')
    textField.remove()
  }

  updateBtnMessage = (api, btn, msg) => {
    let reset = api === 'left' ? 'right' : 'left'
    this.resetButtons(reset)
    this.setState(prevState => {
      const updateBtnLabel = {
        ...prevState[api],
        [btn]: msg
      }

      return ({
        [api]: updateBtnLabel
      })
    })
  }

  // Copy to clipboard
  onCurlCopy = apiId => {
    const field = document.getElementById(apiId)
    const text = field.textContent
    this.copyToClipboard(text)

    this.updateBtnMessage(apiId, 'curlBtn', 'Copied!')
  }

  // Copy JSON response to clipboard
  onCopyRes = (api, res) => {
    this.copyToClipboard(res)
    this.updateBtnMessage(api, 'jsonBtn', 'Copied!')
  }

  // Send http request to api
  onSendReq = api => {
    return new Promise((resolve, reject) => {
      this.resetButtons(api)
      const { url, host, pid } = this.state[api]
      const { endpoint, token } = this.state

      sendReq({ url, host, pid, endpoint, token })
        .then(result => {
          // create config for v2 result
          const config = jdd.createConfig()
          jdd.formatAndDecorate(config, result)
          this.setState(prevState => {
            const updatedApi = {
              ...prevState[api],
              resp: config.out,
              respJson: JSON.stringify(result),
            }
            return ({
              [api]: updatedApi
            })
          })
          resolve('Success')
        })
        .catch(error => {
          this.setState(prevState => {
            const updateApiErr = {
              ...prevState[api],
              resp: error
            }

            if (!error.status) {
              updateApiErr.jsonBtn = '404'

              if (error.message.indexOf('code') !== -1) {
                let idx = error.message.indexOf('code') + 5
                updateApiErr.jsonBtn = error.message.slice(idx, idx + 3)
              }
            } else {
              updateApiErr.jsonBtn = error.response.status
            }

            return ({
              [api]: updateApiErr
            })
          })
        })
    })
  }

  // Change value of method and stage
  onChangeMethod = event => {
    this.resetAllButtons()

    this.setState({
      method: event.target.value
    })
  }

  // Update res in textarea
  onUpdateRes = event => {
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
        let line = msg.substring(msg.indexOf('line') + 5)
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
    const v2Config = jdd.createConfig()
    jdd.formatAndDecorate(v2Config, v2Raw)
    const v3Config = jdd.createConfig()
    jdd.formatAndDecorate(v3Config, v3Raw)

    // Find differences values and store them in jdd.diffs
    jdd.diffs = []
    jdd.diffVal(v2Raw, v2Config, v3Raw, v3Config)

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
    let report
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
      left,
      right,
      token,
      endpoint,
      env,
      pid,
      show,
      btnCompText,
      compared,
      parseError,
      diffLinesL,
      diffLinesR,
      report,
      diffNum
    } = this.state

    return (
      <div className="App">
        <div className="jumbotron">
          <h1 className="title">Migration Testing</h1>
          <br />
          <ReqForm
            env={env}
            endpoint={endpoint}
            token={token}
            pid={pid}
            onChangeField={this.onChangeInputField}
            onClearField={this.onClearInput}
            onChangeMethod={this.onChangeMethod}
          />
        </div>
        <Apis
          leftApi={left}
          rightApi={right}
          token={token}
          endpoint={endpoint}
          onCopyCurl={this.onCurlCopy}
          onSendReq={this.onSendReq}
          onCopyRes={this.onCopyRes}
        />
        <br />
        <Diff
          showDiffs={this.onShowDiffs}
          show={show}
          leftResp={left.resp}
          rightResp={right.resp}
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
          report={report}
          diffNum={diffNum}
        />
        <Footer />
      </div>
    )
  }
}

export default App
