import {Header} from "../components";
import { h, Component } from "preact";
import "./landing.scss";
import wave from "./wave.svg";
/** @jsx h */

export class Form extends Component {
  render() {
    return (
      <div>
        <div className="columns is-centered">
          <div className="field column form-input">
            <div className="control has-icons-left">
              <input className="input is-large" type="email" placeholder="Your email"/>
              <span className="icon is-medium is-left">
                <i className="far fa-envelope"></i>
              </span>
            </div>
          </div>

          <div className="field column is-one-fifth">
            <div className="control">
              <button className="button is-primary is-large"><strong>Try for free</strong></button>
            </div>
          </div>
        </div>
        <label>Already have an account? <a className="is-link"><strong>Sign In</strong></a></label> 
      </div>
    );
  }
}

export class Landing extends Component {
  render() {
    return (
      <div>
        <Header />

        <section className="section wave">
          <div className="container is-centered has-text-centered">
            <h1 className="title is-1 is-spaced">Your frienships get better here</h1>
            <p className="subtitle">Every day is an opportunity to get closer to those that matter to you</p>
            <Form />
          </div>
        </section>
        
        <section className="section">
          <div className="container">
            <h1 className="title is-2 is-spaced">The features you need, in one place</h1>
            <div className="columns">
              <ul className="content column">
                <li>
                  <a className="box">
                    <p>
                      <strong>Manage all your contacts information</strong>
                      <br/>
                      <label>Every detail can be recorded</label>
                    </p>
                  </a>
                </li>
                <li>
                  <a className="box">
                    <p>
                      <strong className="is-link">Never miss on opportunities to get in touch.</strong>
                      <br/>
                      <label>With notifications about relevant events on the persons life</label>
                    </p>
                  </a>
                </li>
                <li>
                  <a className="box">
                    <p>
                      <strong className="is-link">Follow up with all your contacts in the most efficient way</strong>
                      <br/>
                      <label>Our system will calculate the perfect spacing and will propose dates based on your agenda to schedule meetings</label>
                    </p>
                  </a>
                </li>
              </ul>
              <img className="column" src="https://s3.amazonaws.com/media.skillcrush.com/uploads/2012/10/27173259/wireframe-sketch-15.jpeg" />
            </div>
          </div>
        </section>
      </div>
    );
  }
}
