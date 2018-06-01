import {h} from 'preact';
import Box from './box';

class BoxColor extends Box {
  render() {
    const {props} = this;
    const {rect, children} = props;
    // const props = Object.assign({}, this.props);
    // delete props.rect;
    // const {rect, children} = this.props;
    const values = rect.values === null ? {} : rect.values;
    // console.log(values);
    // const props = Object.assign({}, this.props);
    // delete props.rect;
    return (
      <div
      {...props.dom}
        style={Object.assign({
          position: 'absolute',
          top: `${rect.y * 100 - rect.height / 2 * 100}%`,
          right: `${(1 - rect.x) * 100 - rect.width / 2 * 100}%`,
          bottom: `${(1 - rect.y) * 100 - rect.height / 2 * 100}%`,
          left: `${rect.x * 100 - rect.width / 2 * 100}%`,
        }, props.dom.style, {
          background: values.color,
        })}>
          {children}
      </div>
    );
  }
}

BoxColor.rectTypes = {
  color: {
    edit(source) {return source;},
    filter(source) {return source;},
  },
};

export default BoxColor;
