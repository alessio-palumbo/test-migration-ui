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
      label: 'API 1',
      endpoint: '',
      token: '',
      curlBtn: 'Copy Curl',
      jsonBtn: 'JSON',
      config: null,
      resp: '',
      respJson: ''
    },
    right: {
      id: 'right',
      label: 'API 2',
      endpoint: '',
      token: '',
      curlBtn: 'Copy Curl',
      jsonBtn: 'JSON',
      config: null,
      resp: '',
      respJson: ''
    },
    method: 'GET',
    env: '',
    endpoint: '',
    token: '',
    pid: '',
    show: false,
    compared: false,
    parseError: { msg: '', line: '', side: '' },
    diffLinesL: null,
    diffLinesR: null,
    diffNum: 0,
    report: ''
  }

  componentDidMount() {
    // Check if it's a custom request coming from slack, otherwise retrieve last used fields
    if (!this.fillFromParams()) {
      this.getCachedData()
    }
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
      left.label = 'V2'
      left.url = `${base}/v2${endpoint}${testing}`
      left.host = `${env}-v2-${hostBase}`

      const right = this.state.right
      right.label = 'V3'
      right.url = `${base}${endpoint}${testing}stage=${env}`
      right.host = `${query.get('v3host')}-v3-${hostBase}`

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

  getCachedData() {
    const lastLeftEndpoint = localStorage.getItem('left-endpoint')
    const lastLeftToken = localStorage.getItem('left-token')
    const lastRightEndpoint = localStorage.getItem('right-endpoint')
    const lastRightToken = localStorage.getItem('right-token')

    this.setState(prevState => {
      const cachedLeft = {
        ...prevState.left,
        endpoint: lastLeftEndpoint,
        token: lastLeftToken
      }

      const cachedRight = {
        ...prevState.right,
        endpoint: lastRightEndpoint,
        token: lastRightToken
      }

      return ({
        left: cachedLeft,
        right: cachedRight
      })
    })
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

  // Change value of method and stage
  onChangeMethod = event => {
    this.resetAllButtons()

    this.setState({
      method: event.target.value
    })
  }

  // Update text in custom input fields
  onChangeCustomInputField = event => {
    this.resetAllButtons()
    const input = event.target.name
    const text = event.target.value.trim()

    this.setState({ [input]: text })
  }

  // Update text in apis input fields
  onChangeApiInputField = event => {
    this.resetAllButtons()
    const input = event.target.name
    const text = event.target.value.trim()

    localStorage.setItem(input, text)

    const [api, field] = input.split('-')
    this.setState(prevState => {
      const updatedField = {
        ...prevState[api],
        [field]: text
      }

      return ({
        [api]: updatedField
      })
    })
  }

  // Clear custom inputs when clicking on the reset button
  onClearCustomInput = event => {
    const input = event.target.name
    this.resetAllButtons()
    console.log(input)
    this.setState({ [input]: '' })
  }

  // Clear api inputs when clicking on the reset button
  onClearApiInput = event => {
    const input = event.target.name
    this.resetAllButtons()

    const [api, field] = input.split('-')
    this.setState(prevState => {
      const clearedInput = {
        ...prevState[api],
        [field]: ''
      }

      return ({
        [api]: clearedInput
      })
    })
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
      const { url, host, pid, endpoint, token } = this.state[api]
      // const { endpoint, token } = this.state

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

  // Update res in textarea
  onUpdateRes = event => {
    const api = event.target.name
    const input = event.target.value

    this.setState(prevState => {
      const updatedApi = {
        ...prevState[api],
        resp: input
      }

      if (this.validateJSON(updatedApi)) {
        return ({
          resp: updatedApi
        })
      }
    })
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
      if (!this.compareJSON()) { return }
    }

    this.setState({
      compared: !compared
    })
  }

  // CompareJSON logic
  compareJSON = () => {
    const { left, right } = this.state

    // validate the json input
    let leftRaw = this.validateJSON(left)
    if (leftRaw === false) {
      return false
    }
    let rightRaw = this.validateJSON(right)
    if (rightRaw === false) {
      return false
    }

    let diffs = this.getApiDiffs(leftRaw, rightRaw)

    // Store the error lines
    const diffLinesL = new Array(left.resp.split('\n').length - 1)
    const diffLinesR = new Array(right.resp.split('\n').length - 1)
    let diffNum = 0

    diffs.map(diff => {
      diffNum++
      diffLinesL[diff.path1.line] = diff.type
      diffLinesR[diff.path2.line] = diff.type
    })

    // Write report
    let report = 'Yey! No differences found!'
    if (diffNum !== 0) {
      report = `Found ${diffNum} ${diffNum > 1 ? 'differences' : 'difference'}.`
    }

    this.setState({
      diffLinesL: diffLinesL,
      diffLinesR: diffLinesR,
      diffNum: diffNum,
      report: report
    })

    return true
  }

  getApiDiffs = (leftRaw, rightRaw) => {
    // create config
    const leftConfig = jdd.createConfig()
    jdd.formatAndDecorate(leftConfig, leftRaw)

    const right = jdd.createConfig()
    jdd.formatAndDecorate(right, rightRaw)

    // Find differences values and store them in jdd.diffs
    jdd.diffs = []
    jdd.diffVal(leftRaw, leftConfig, rightRaw, right)

    return jdd.diffs
  }

  // Validate the JSON input
  validateJSON = (api) => {
    // Reset any previous error
    this.setState({
      parseError: {}
    })

    try {
      let parsedInput = jsonlint.parse(api.resp)
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
            side: api.id
          }
        })
      }
      return false
    }
  }

  render() {
    const {
      left,
      right,
      env,
      token,
      endpoint,
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
            leftApi={left}
            rightApi={right}
            onChangeCustomField={this.onChangeCustomInputField}
            onClearCustomField={this.onClearCustomInput}
            onChangeApiField={this.onChangeApiInputField}
            onClearApiField={this.onClearApiInput}
            onChangeMethod={this.onChangeMethod}
          />
        </div>
        <Apis
          leftApi={left}
          rightApi={right}
          token={token}
          endpoint={endpoint}
          pid={pid}
          onChangeApiField={this.onChangeApiInputField}
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
