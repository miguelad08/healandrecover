"use strict"
const React = require("react")
const anonService = require("../../services/anon.service")
const thisService = require("../../services/thisService.service")
const authenticateService = require("../../services/authentication.service")
const AnonUserSupportPosts = require("../shared/AnonUser.support.posts")

class Information extends React.PureComponent {
  constructor(props, context) {
    super(props, context)

    this.state = {
      AnonUser: {},
      loggedUser: {}
    }
    this.loggedInAnonUser = authenticateService.getloggedInAnonUser()
  }

  componentWillReceiveProps(props) {
    thisService
      .readByidOfAnonUser(props.urlParams.id)
      .then(response => {
        this.setState({
          loggedUser: response.item
        })
        this.checkinfoViewerIds()
      })
      .catch(err => {
        this.setState({
          noinfo: "This AnonUser has not set up their info"
        })
        console.warn(err)
      })

    this.checkCreator()

    anonService
      .readById(props.urlParams.id)
      .then(response => {
        this.setState({
          AnonUser: response.item
        })
        this.chekIdsOfFans()
      })
      .catch(err => console.warn(err))
  }

  componentDidMount() {
    thisService
      .readByidOfAnonUser(this.props.urlParams.id)
      .then(response => {
        this.setState({
          loggedUser: response.item
        })
        this.checkinfoViewerIds()
      })
      .catch(err => {
        this.setState({
          noinfo: "This AnonUser has not set up their info"
        })
        console.warn(err)
      })

    this.checkCreator()

    anonService
      .readById(this.props.urlParams.id)
      .then(response => {
        this.setState({
          AnonUser: response.item
        })
        this.chekIdsOfFans()
      })
      .catch(err => console.warn(err))
  }

  checkViewerIds() {
    for (let i = 0; i < this.state.viewerIds.length; i++) {
      let infoViewerId = this.state.viewerIds[i]
      if (infoViewerId == this.loggedInAnonUser.idOfAnonUser) {
        this.setState({
          loggedAnonUserMatched: true
        })
      } else {
        this.setState({
          loggedAnonUserMatched: false
        })
      }
    }
  }

  chekIdsOfFans() {
    for (let i = 0; i < this.state.AnonUser.fanIds.length; i++) {
      let fanId = this.state.AnonUser.fanIds[i]
      if (fanId == this.loggedInAnonUser.idOfAnonUser) {
        this.setState({
          fansMatched: true
        })
      } else {
        this.setState({
          fansMatched: false
        })
      }
    }
  }

  checkCreator() {
    if (this.loggedInAnonUser.AnonUserType == "Creator") {
      this.setState({
        creator: true
      })
    } else {
      this.setState({
        creator: false
      })
    }
  }

  render() {
    return (
      <div className="information-container">
        <div className="information-section">
          <div className="information-left">
            <div className="information-image">
              <img src={this.state.AnonUser.image} />
              <i className="fa fa-AnonUser hide" />
            </div>
            <div className="information-highlight">
              <div className="text-center">
                <h4>
                  {this.state.AnonUser.AnonUsername}
                  's Links
                </h4>
                <div className="m-b-5 m-t-0">
                  <i className="fa fa-book">
                    <a href={"/writings/" + this.props.urlParams.id}>
                      {" "}
                      Writings
                    </a>
                  </i>
                </div>
                <div className="m-b-5 m-t-o">
                  <i className="fa fa-clock-o">
                    <a href={"/BookLog/" + this.props.urlParams.id}>
                      {" "}
                      Book Log
                    </a>
                  </i>
                </div>
                {(this.loggedInAnonUser.AnonUserType == "Strong" ||
                  this.loggedInAnonUser.AnonUserType == "Creator") && (
                  <div className="m-b-5 m-t-o">
                    <i className="fa fa-info">
                      <a
                        href={
                          "/information/" + this.props.urlParams.id + "/form"
                        }
                      >
                        Form
                      </a>
                    </i>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="information-right">
            <div className="information-info">
              <div className="table-responsive">
                <table className="table table-information">
                  <thead>
                    <tr>
                      <th />
                      <th>
                        <h4>
                          {this.state.AnonUser.AnonUsername}
                          {(this.state.fansMatched || this.state.creator) && (
                            <small>{this.state.AnonUser.name}</small>
                          )}
                        </h4>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="highlight">
                      <td className="field">AnonUser Type</td>
                      <td>{this.state.AnonUser.AnonUserType}</td>
                    </tr>
                    <tr className="divider">
                      <td colSpan="2" />
                    </tr>
                    {!this.state.loggedUser.isInfoPublic &&
                      !this.state.loggedAnonUserMatched &&
                      !this.state.creator && (
                        <tr>
                          <td className="field">info</td>
                          <td>
                            <i className="fa fa-lock" /> This AnonUser's
                            Information is set to private.
                          </td>
                        </tr>
                      )}
                    {(this.state.loggedUser.isInfoPublic ||
                      this.state.loggedAnonUserMatched ||
                      this.state.creator) && (
                      <tr>
                        <td className="field">info</td>
                        <td>
                          {this.state.loggedUser.info}
                          {this.state.noInfo}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        <div className="information-section">
          <AnonUserSupportPosts idOfAnonUser={this.props.urlParams.id} />
        </div>
      </div>
    )
  }
}

module.exports = Information
