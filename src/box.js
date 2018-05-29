import {h, Component} from 'preact';

class Box extends Component {
  render() {
    const {rect, children} = this.props;
    const props = Object.assign({}, this.props);
    delete props.rect;
    return (
      <div
        {...props}
        style={Object.assign({
          position: 'absolute',
          top: `${rect.y * 100 - rect.height / 2 * 100}%`,
          right: `${(1 - rect.x) * 100 - rect.width / 2 * 100}%`,
          bottom: `${(1 - rect.y) * 100 - rect.height / 2 * 100}%`,
          left: `${rect.x * 100 - rect.width / 2 * 100}%`,
        }, props.style)}>
        {children}
      </div>
    );
  }
}

export default Box;
