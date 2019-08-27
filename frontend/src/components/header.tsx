import { h, Component } from "preact";
/** @jsx h */

import logo from './logo.svg';

export class Header extends Component {
  render() {
    return (
      <nav className="navbar has-shadow is-spaced" role="navigation" aria-label="main navigation">
        <div className="navbar-brand">
          <a className="navbar-item" href="/">
            <img src={logo} width="112" height="28"/>
          </a> 
        </div>
  
        <div id="nav_menu" className="navbar-menu">
  
          <div className="navbar-end">
            <div className="navbar-item">
              <div className="buttons">
                <a className="button is-primary">
                  <strong>Sign up</strong>
                </a>
                <a className="button is-light">
                  Sign in
                </a>
              </div>
            </div>
          </div>
        </div>
      </nav>
    );
  }
}

export default Header;
