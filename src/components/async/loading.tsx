import React from "react";

import {NavBar} from "..";

interface AsyncLoadingState {
  showLoadingSpinner: boolean;
}

export default class AsyncLoading extends React.PureComponent<{}, AsyncLoadingState> {
  public constructor(props: any) {
    super(props);

    this.state = {
      showLoadingSpinner: false,
    };
  }

  public componentWillReceiveProps() {
    this.setState({ showLoadingSpinner: false });

    // Show loading spinner after 500ms to avoid flash of content for normal-loading pages
    setTimeout(() => {
      this.setState({ showLoadingSpinner: true });
    }, 500);
  }

  public render() {
    return (
        <main>
          <NavBar />

          {this.state.showLoadingSpinner ? (
            <div>Loading</div>
          ) : null}
        </main>
    );
  }
}
