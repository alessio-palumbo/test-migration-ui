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
    method: 'GET',
    left: {
      id: 'left',
      label: 'API 1',
      endpoint: '',
      token: '',
      curlCopied: false,
      jsonCopied: false,
      config: null,
      resp: '',
      respJson: '',
      respError: null,
      time: '',
      parseError: null
    },
    right: {
      id: 'right',
      label: 'API 2',
      endpoint: '',
      token: '',
      curlCopied: false,
      jsonCopied: false,
      config: null,
      resp: '',
      respJson: '',
      respError: null,
      time: '',
      parseError: null
    },
    show: false,
    compared: false,
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
      left.endpoint = `${base}/v2${endpoint}${testing}`
      left.host = `${env}-v2-${hostBase}`
      left.pid = pid

      const right = this.state.right
      right.label = 'V3'
      right.endpoint = `${base}${endpoint}${testing}stage=${env}`
      right.host = `${query.get('v3host')}-v3-${hostBase}`
      right.pid = pid

      this.setState(
        {
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

  TODO
  // Reset buttons text to default
  resetButtons = api => {
    this.setState(prevState => {
      const updateApi = {
        ...prevState[api],
        curlCopied: false,
        jsonCopied: false
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

  updateBtnMessage = (api, btn) => {
    this.setState(prevState => {
      const updateBtnLabel = {
        ...prevState[api],
        [btn]: !prevState[api][btn]
      }

      return ({
        [api]: updateBtnLabel
      })
    })

    setTimeout(() => {
      this.setState(prevState => {
        const resetBtnLabel = { ...prevState[api] }
        if (resetBtnLabel[btn] === true) {
          resetBtnLabel[btn] = false

          return ({
            [api]: resetBtnLabel
          })
        }
      })
    }, 800)
  }

  // Copy to clipboard
  onCurlCopy = ({ id, curl }) => {
    this.copyToClipboard(curl)
    this.updateBtnMessage(id, 'curlCopied')
  }

  // Copy JSON response to clipboard
  onCopyResp = api => {
    this.copyToClipboard(this.state[api].respJson)
    this.updateBtnMessage(api, 'jsonCopied')
  }

  // Send http request to api
  onSendReq = api => {
    return new Promise((resolve, reject) => {
      const { endpoint, token, host, pid } = this.state[api]

      let startTimer = new Date()
      sendReq({ endpoint, token, host, pid })
        .then(result => {
          let elapsed = new Date() - startTimer

          // create formatted response to be displayed in textareas
          const config = jdd.createConfig()
          jdd.formatAndDecorate(config, result)
          this.setState(prevState => {
            const updatedApi = {
              ...prevState[api],
              resp: config.out,
              respJson: JSON.stringify(result),
              respError: null,
              time: elapsed
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
              resp: '',
              respJson: '',
              respError: error
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
    const [parsed, error] = this.validateJSON(input)

    this.setState(prevState => {
      const updatedApi = {
        ...prevState[api],
        resp: input,
        respJson: JSON.stringify(parsed),
        parseError: error
      }

      return {
        [api]: updatedApi
      }
    })
  }

  // Show/Hide comparison
  onShowDiffs = () => {
    this.setState(prevState => {
      return { show: !prevState.show }
    })
  }

  // Call compareJSON and change compare button layout
  onCompare = () => {
    const { compared } = this.state
    if (compared === false) {
      this.compareJSON()
    }

    this.setState({
      compared: !compared
    })
  }

  // CompareJSON logic
  compareJSON = () => {
    const { left, right } = this.state

    let diffs = this.getApiDiffs(left.resp, right.resp)

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
  }

  getApiDiffs = (leftResp, rightResp) => {
    // create config
    const leftRaw = jsonlint.parse(leftResp)
    const leftConfig = jdd.createConfig()
    jdd.formatAndDecorate(leftConfig, leftRaw)

    const rightRaw = jsonlint.parse(rightResp)
    const rightConfig = jdd.createConfig()
    jdd.formatAndDecorate(rightConfig, rightRaw)

    this.setState(prevState => {
      const formatLeftResp = {
        ...prevState.left,
        resp: leftConfig.out
      }

      const formatRightResp = {
        ...prevState.right,
        resp: rightConfig.out
      }

      return ({
        left: formatLeftResp,
        right: formatRightResp
      })
    })

    // Find differences values and store them in jdd.diffs
    jdd.diffs = []
    jdd.diffVal(leftRaw, leftConfig, rightRaw, rightConfig)

    return jdd.diffs
  }

  // Validate the JSON input
  validateJSON = input => {
    if (input === '') { return [null, null] }

    try {
      let parsed = jsonlint.parse(input)
      return [parsed, null]
    } catch (e) {
      let msg = e.message
      if (msg.indexOf('Parse error') !== -1) {
        let reason = msg.split(':')[0]
        let error = {
          msg: reason + ' : ' + msg.substr(msg.indexOf('Expecting')),
          line: reason.split(' ').pop()
        }
        return ['Invalid JSON', error]
      }
    }
  }

  render() {
    const { left, right, show, btnCompText, compared, diffLinesL, diffLinesR, report, diffNum } = this.state

    return (
      <div className="App">
        <div className="jumbotron">
          <h1 className="title">Migration Testing</h1>
          <br />
          <ReqForm
            leftApi={left}
            rightApi={right}
            onChangeApiField={this.onChangeApiInputField}
            onClearApiField={this.onClearApiInput}
            onChangeMethod={this.onChangeMethod}
          />
        </div>
        <Apis
          leftApi={left}
          rightApi={right}
          onChangeApiField={this.onChangeApiInputField}
          onCopyCurl={this.onCurlCopy}
          onSendReq={this.onSendReq}
          onCopyResp={this.onCopyResp}
        />
        <br />
        <Diff
          showDiffs={this.onShowDiffs}
          show={show}
          leftApi={left}
          rightApi={right}
          onCompare={this.onCompare}
          onUpdateRes={this.onUpdateRes}
          btnCompText={btnCompText}
          compared={compared}
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
