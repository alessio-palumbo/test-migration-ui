import './App.css'
import './bootstrap-4.0.0-beta.2-dist/css/bootstrap.css'

import jsonlint from 'jsonlint-mod'
import React, { Component } from 'react'

import { Apis } from './components/Apis'
import { Diff } from './components/Diff'
import { Footer } from './components/Footer'
import { ReqForm } from './components/ReqForm'
import { sendReq, loginOSSUser, loginOSSCompany, getUserCompanies, getUrlFromEnv, getFullUrl } from './components/Request'
import jdd from './libs/jdd'

class App extends Component {
  state = {
    left: {
      id: 'left',
      label: 'API 1',
      method: 'GET',
      headers: {},
      endpoint: '',
      token: '',
      isLogin: false,
      env: '',
      baseUrl: '',
      login: '',
      password: '',
      loginId: '',
      username: '',
      userToken: '',
      logins: {},
      history: {},
      payload: '',
      payloadJson: '',
      payloadError: null,
      curl: '',
      curlCopied: false,
      jsonCopied: false,
      reqSent: false,
      resp: '',
      respJson: '',
      respError: null,
      parseError: null,
      time: ''
    },
    right: {
      id: 'right',
      label: 'API 2',
      method: 'GET',
      headers: {},
      endpoint: '',
      token: '',
      isLogin: false,
      env: '',
      baseUrl: '',
      login: '',
      password: '',
      loginId: '',
      username: '',
      userToken: '',
      logins: {},
      history: {},
      payload: '',
      payloadJson: '',
      payloadError: null,
      curl: '',
      curlCopied: false,
      jsonCopied: false,
      reqSent: false,
      resp: '',
      respJson: '',
      respError: null,
      parseError: null,
      time: ''
    },
    acceptedHeaders: ['accept', 'content-type', 'authorization'],
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
    const cachedLeft = JSON.parse(localStorage.getItem('left'))
    const cachedRight = JSON.parse(localStorage.getItem('right'))

    this.setState(prevState => {
      return ({
        left: { ...prevState.left, ...cachedLeft },
        right: { ...prevState.right, ...cachedRight }
      })
    })
  }

  // Switch token from user to companies, if any
  onChangeLoginType = (event, api) => {
    let [updatedId, updatedToken] = event.target.value.split('|')

    if (updatedToken) {
      return this.setState(prevState => {
        return ({
          [api]: {
            ...prevState[api],
            token: updatedToken,
            loginId: updatedId,
            baseUrl: getUrlFromEnv(prevState[api].logins[updatedId].env)
          }
        })
      })
    }

    this.setState(prevState => {
      return ({
        [api]: {
          ...prevState[api],
          token: 'Logging...'
        }
      })
    })

    loginOSSCompany(updatedId, this.state[api].userToken, this.state[api].env)
      .then(result => {
        let token = result.access_token
        this.setState(prevState => {
          const updatedApi = {
            ...prevState[api],
            token: token,
            loginId: updatedId,
            baseUrl: getUrlFromEnv(prevState[api].logins[updatedId].env)
          }
          updatedApi.logins[updatedId].token = token

          return ({
            [api]: updatedApi
          })
        })
      })
      .catch(error => {
        this.setState(prevState => {
          return ({
            [api]: {
              ...prevState[api],
              respError: error
            }
          })
        })
      })
  }

  // Change value of api method
  onChangeMethod = (event, api) => {
    const updatedMethod = event.target.value

    this.setState(prevState => {
      let updatedApi = {
        ...prevState[api],
        method: updatedMethod
      }

      if (updatedApi.method !== 'PUT' || updatedApi.method !== 'POST') {
        updatedApi.payload = ''
        updatedApi.payloadJson = ''
        updatedApi.payloadError = null
      }

      return {
        [api]: updatedApi
      }
    })
  }

  onChangeEnv = (event, api) => {
    const updatedEnv = event.target.value

    this.setState(prevState => {
      return ({
        [api]: {
          ...prevState[api],
          env: updatedEnv
        }
      })
    })
  }

  // Update text in apis input fields
  onChangeApiInputField = event => {
    const input = event.target.name
    const text = event.target.value.trim()

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
    // Remove any login related data when the user clears the token field
    if (field === 'token') {
      this.resetLoginData(api)
    }

    this.setState(prevState => {
      const clearedInput = {
        ...prevState[api],
        [field]: '',
        headers: {} // Reset headers in case there a curl was parsed. TODO add select header ctl
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
    let curl = `curl '${getFullUrl(api.baseUrl, api.endpoint)}'`
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

  // OnLogin allow the user to login and retrieve the token from the response
  onLogin = api => {
    this.setState(prevState => {
      return ({
        [api]: {
          ...prevState[api],
          isLogin: !prevState[api].isLogin
        }
      })
    })
  }

  resetLoginData = (api) => {
    this.setState(prevState => {
      return ({
        [api]: {
          ...prevState[api],
          env: '',
          baseUrl: '',
          logins: {},
          loginId: '',
          username: '',
        }
      })
    })
  }

  isValidCurl = curl => {
    if (curl.indexOf('curl') !== 0) return false
    if (curl.indexOf('http') === -1) return false
    if (curl.toLowerCase().indexOf('authorization') === -1) return false

    return true
  }

  // Copy curl from clipboard and update api fields
  onCopyClip = async api => {
    let curl = await navigator.clipboard.readText();

    // Exit if clipboard does not start with 'curl'
    if (!this.isValidCurl(curl)) return
    this.resetLoginData(api)
    this.setState(prevState => {
      const updatedApi = {
        ...prevState[api],
        method: 'GET',
        curl: curl
      }

      let httpStr = curl.substr(curl.indexOf("'http")).split(' ')[0]
      curl = curl.replace(httpStr, '')
      updatedApi.endpoint = httpStr.replace(/['"]+/g, '')

      curl.split(' -').map(line => {
        let [type, content] = line.trim().split(' \'')
        if (content === undefined) [type, content] = line.split(' ')

        switch (type) {
          case 'H':
            let splitHeader = content.replace(/['"]+/g, '').split(": ")
            // Handle any :header: headers and only accept method
            if (splitHeader.length === 3) {
              if (splitHeader[1] === 'method') updatedApi.method = splitHeader[2]
              return
            }

            // Filter out unneeded headers
            let header = splitHeader[0].toLowerCase()
            if (!prevState.acceptedHeaders.includes(header)) return
            if (header === 'authorization') updatedApi.token = splitHeader[1].split(' ')[1]
            return updatedApi.headers[splitHeader[0]] = splitHeader[1]
          case 'X':
            return updatedApi.method = content
          case 'd':
          case '-data-binary':
            updatedApi.method = updatedApi.method === 'PUT' ? 'PUT' : 'POST'
            let payload = content.substr(0, content.length - 1)
            updatedApi.payloadJson = payload
            updatedApi.payload = this.formatJSON(JSON.parse(payload))
        }
      })

      return ({
        [api]: updatedApi
      })

    }, function () { return this.onSendReq(api) })
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
    if (error !== null) {
      error.display = false
    }

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

  onClearPreviousReq = api => {
    return this.setState(prevState => {
      const sending = {
        ...prevState[api],
        reqSent: true,
        resp: '',
        respJson: '',
        respError: null,
        parseError: null,
        time: ''
      }

      return ({
        [api]: sending
      })
    })
  }

  getCompanies = api => {
    // send get user with companies and set user name, then if companies populate select
    const currentApi = this.state[api]
    getUserCompanies(currentApi)
      .then(result => {
        const user = result.user
        // Do not process logins if the user has a single one
        if (user.companies.length === 0) return

        this.setState(prevState => {
          const env = prevState[api].env
          const logins = {
            [user.id]: {
              name: user.name,
              role: 'worker',
              token: prevState[api].token,
              env: env
            }
          }

          user.companies.map(c => {
            logins[c.id] = {
              name: c.name,
              role: c.role,
              token: '',
              env: env
            }
          })

          const updatedApi = {
            ...prevState[api],
            username: user.name,
            loginId: user.id,
            logins: logins
          }

          return ({
            [api]: updatedApi
          })
        })
      })
      .catch(error => {
        this.setState(prevState => {
          return ({
            [api]: {
              ...prevState[api],
              respError: error
            }
          })
        })
      })
  }

  validateLogin = login => {
    if (login.match(/^\+?[0-9]+/g)) {
      console.log('match n')
      if (login.charAt(0) === '+') {
        console.log(login, 'fr')
        login = login.substr(1)
        console.log('logadfte', login)
      }
      return login
    }
    if (login.match(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)) {
      console.log('match email')
      return login
    }

    return false
  }

  onSendLoginReq = api => {
    let { login, env, password } = this.state[api]
    login = this.validateLogin(login)
    if (!login) return

    this.onClearPreviousReq(api)
    env = env || process.env.REACT_APP_DEFAULT_ENV
    loginOSSUser(env, login, password)
      .then(result => {
        const token = result.access_token

        this.setState(prevState => {
          const updatedApi = {
            ...prevState[api],
            reqSent: false,
            token: token,
            userToken: token,
            isLogin: false,
            env: env,
            baseUrl: getUrlFromEnv(env),
            endpoint: '',
            headers: {}
          }

          // store successful login details in localstorage
          const storedLogin = {
            ...JSON.parse(localStorage.getItem(api)),
            env: env,
            login: updatedApi.login,
            password: updatedApi.password
          }
          localStorage.setItem(api, JSON.stringify(storedLogin))

          return ({
            [api]: updatedApi
          })
        })
      })
      .then(() => {
        this.getCompanies(api)
      })
      .catch(error => {
        this.setState(prevState => {
          return ({
            [api]: {
              ...prevState[api],
              respError: error,
              reqSent: false
            }
          })
        })
      })
  }

  // Send http request to api
  onSendReq = api => {
    const currentApi = this.state[api]
    if (currentApi.isLogin) {
      if (currentApi.login && currentApi.password) {
        return this.onSendLoginReq(api)
      }
      return
    }

    if (!currentApi.endpoint) {
      return
    }

    let payloadError = currentApi.payloadError
    if ((currentApi.method === 'POST' || currentApi.method === 'PUT') && (payloadError || !currentApi.payloadJson)) {
      if (payloadError) {
        payloadError.display = true
      } else {
        payloadError = 'Missing Payload!'
      }

      return this.setState(prevState => {
        return ({
          [api]: {
            ...prevState[api],
            payloadError: payloadError
          }
        })
      })
    }

    this.onClearPreviousReq(api)

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
              time: elapsed,
            }

            // store successful request details in localstorage
            const storedReq = {
              ...JSON.parse(localStorage.getItem(api)),
              method: updatedApi.method,
              endpoint: updatedApi.endpoint,
              token: updatedApi.token
            }

            if (updatedApi.baseUrl) {
              updatedApi.history = this.updateHistory(updatedApi)
              storedReq.history = updatedApi.history
            }

            localStorage.setItem(api, JSON.stringify(storedReq))

            return ({
              [api]: updatedApi
            })
          })
          resolve('Success')
        })
        .then(() => {
          this.setState({ show: true })
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

  updateHistory = api => {
    let { history, loginId, env, method, endpoint, payloadJson } = api

    let data = {
      method: method,
      endpoint: endpoint,
      payload: payloadJson
    }

    if (!history[loginId]) {
      history[loginId] = { [env]: [data] }
    } else if (!history[loginId][env]) {
      history[loginId] = {
        ...history[loginId],
        [env]: [data]
      }
    } else {
      let saved = history[loginId][env]
      let savedIdx = saved.findIndex(item => {
        return (item.endpoint === endpoint && item.method === method)
      })

      if (savedIdx !== -1) {
        saved.splice(savedIdx, 1)
      }
      saved.unshift(data)
      if (saved.length > 10) saved = saved.slice(0, 10)
      history[loginId][env] = saved
    }

    return history
  }

  onChangeEndpoint = (event, api) => {
    const updated = JSON.parse(event.target.value)

    this.setState(prevState => {
      let updatedApi = {
        ...prevState[api],
        endpoint: updated.endpoint,
        method: updated.method,
        payloadJson: updated.payload,
        payload: updated.payload && this.formatJSON(JSON.parse(updated.payload)),
        resp: '',
        respJson: '',
        respError: null,
        parseError: null,
        time: ''
      }

      return {
        [api]: updatedApi
      }
    },
      function () { updated.method === 'GET' && this.onSendReq(api) }
    )
  }

  // Update res in textarea
  onUpdateRes = event => {
    const api = event.target.name
    const input = event.target.value
    const [parsed, error] = this.validateJSON(input)

    this.setState(prevState => {
      const updatedApi = {
        ...prevState[api],
        resp: parsed ? this.formatJSON(parsed) : input,
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
            onChangeEnv={this.onChangeEnv}
            onCopyClip={this.onCopyClip}
            onLogin={this.onLogin}
            onPressEnter={this.onPressEnter}
            onChangeLoginType={this.onChangeLoginType}
            onUpdatePayload={this.onUpdatePayload}
            onChangeEndpoint={this.onChangeEndpoint}
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
