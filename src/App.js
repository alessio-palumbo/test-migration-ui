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
      method: 'GET',
      endpoint: '',
      token: '',
      headers: {},
      payload: '',
      payloadJson: '',
      payloadError: null,
      curl: '',
      curlCopied: false,
      jsonCopied: false,
      reqSent: false,
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
      method: 'GET',
      endpoint: '',
      token: '',
      headers: {},
      payload: '',
      payloadJson: '',
      payloadError: null,
      curl: '',
      curlCopied: false,
      jsonCopied: false,
      reqSent: false,
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
    if (query && query.has('left') && query.has('right')) {
      const token = query.get('token')

      let queryString = window.location.search
      let offset = '?left='.length
      const [leftEndpoint, rightEndpoint] = queryString
        .substr(offset, queryString.indexOf('&token') - offset)
        .split('&right=')

      const left = {
        ...this.state.left,
        label: 'V2',
        endpoint: leftEndpoint,
        token: token
      }

      const right = {
        ...this.state.right,
        label: 'V3',
        endpoint: rightEndpoint,
        token: token
      }

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

  // Change value of api method
  onChangeMethod = (event, api) => {
    let updatedMethod = event.target.value
    this.setState(prevState => {
      return ({
        [api]: {
          ...prevState[api],
          method: updatedMethod
        }
      })
    })
  }

  // Update text in apis input fields
  onChangeApiInputField = event => {
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

  // Change label when button is clicked for a set time
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

  // Copy JSON to clipboard
  copyToClipboard = text => {
    const textField = document.createElement('textarea')
    textField.innerText = text
    document.body.appendChild(textField)
    textField.select()
    document.execCommand('copy')
    textField.remove()
  }

  buildCurl = api => {
    let curl = `curl '${api.endpoint}'`
    if (api.method !== '' && api.method !== 'GET' && api.method !== 'POST') {
      curl += ` -X ${api.method}`
    }
    curl += ` -H 'Accept: application/json' -H 'Content-Type: application/json;charset=UTF-8' -H 'Authorization: Bearer ${api.token}'`

    if (api.payloadJson !== '') {
      curl += ` -d ${api.payloadJson}`
    }
    return curl
  }

  // Copy curl to clipboard or build and copy curl
  onCurlCopy = id => {
    let api = this.state[id]
    let curl = this.buildCurl(api)

    this.copyToClipboard(curl)
    this.updateBtnMessage(id, 'curlCopied')
  }

  // Format a valid json object into a prettified string
  formatJSON = json => {
    const config = jdd.createConfig()
    jdd.formatAndDecorate(config, json)

    return config.out.trim()
  }

  // Copy curl from clipboard and update api fields
  onCopyClip = async api => {
    const curl = await navigator.clipboard.readText();

    this.setState(prevState => {
      const updatedApi = {
        ...prevState[api],
        method: '',
        curl: curl
      }

      curl.replace(/\'/g, '').split(' -').map(line => {
        switch (line.substr(0, 2)) {
          case 'H ':
            let splitHeader = line.substr(2).trim().split(": ")
            if (splitHeader[0] === 'Authorization') updatedApi.token = splitHeader[1].split(' ')[1]
            return updatedApi.headers[splitHeader[0]] = splitHeader[1]
          case 'X ':
            return updatedApi.method = line.substr(1).trim()
          case 'd ':
          case '-d':
            updatedApi.method = !updatedApi.method && 'POST'
            updatedApi.payloadJson = line.substr(line.indexOf(' ') + 1)
            updatedApi.payload = this.formatJSON(JSON.parse(line.substr(line.indexOf(' ') + 1)))
            return
        }

        if (line.indexOf('http') !== -1) {
          return updatedApi.endpoint = line.substr(line.indexOf('http'))
        }
      })

      return ({
        [api]: updatedApi
      })

    })
  }

  onPressEnter = e => {
    const api = e.target.name.split('-')[0]
    if (e.key === 'Enter') {
      return this.onSendReq(api)
    }
  }

  onUpdatePayload = event => {
    const api = event.target.name
    const input = event.target.value
    const [parsed, error] = this.validateJSON(input)

    this.setState(prevState => {
      const updatedApi = {
        ...prevState[api],
        payload: parsed ? this.formatJSON(parsed) : input,
        payloadJson: parsed && JSON.stringify(parsed),
        payloadError: error
      }

      return {
        [api]: updatedApi
      }
    })
  }

  // Copy JSON response to clipboard
  onCopyResp = api => {
    this.copyToClipboard(this.state[api].respJson)
    this.updateBtnMessage(api, 'jsonCopied')
  }

  // Send http request to api
  onSendReq = api => {
    if (this.state[api].endpoint === '' ||
      this.state[api].token === '' ||
      this.state[api].payloadJson === '') {
      return
    }

    this.setState(prevState => {
      const sending = {
        ...prevState[api],
        reqSent: true,
        resp: '',
        respJson: '',
        respError: null,
        time: ''
      }

      return ({
        [api]: sending
      })
    })

    return new Promise((resolve, reject) => {
      let startTimer = new Date()
      sendReq(this.state[api])
        .then(result => {
          let elapsed = new Date() - startTimer

          // create formatted response to be displayed in textareas
          const formattedResp = this.formatJSON(result)
          this.setState(prevState => {
            const updatedApi = {
              ...prevState[api],
              reqSent: false,
              resp: formattedResp,
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
              reqSent: false,
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
        return ['', error]
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
            onCopyClip={this.onCopyClip}
            onPressEnter={this.onPressEnter}
            onUpdatePayload={this.onUpdatePayload}
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
