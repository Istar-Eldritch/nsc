import React from "react";
import AsyncLoading from "./loading";

interface AsyncComponentState {
  Component: any;
}

export default function asyncComponent(getComponent: () => Promise<any>): any {
  return typeof window === "undefined"
    ? getComponent()
    : class AsyncComponent extends React.Component<{}, AsyncComponentState> {
        public constructor(props: any) {
          super(props);

          this.state = {
            Component: null,
          };
        }

        public async componentDidMount() {
          const { default: Component } = await getComponent();

          this.setState({
            Component,
          });
        }

        public render() {
          const { Component } = this.state;

          return Component ? <Component {...this.props} /> : <AsyncLoading />;
        }
      };
}
