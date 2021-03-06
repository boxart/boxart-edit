import {h, Component} from 'preact';

import {update, animate, present} from 'boxart-functions';

class Box extends Component {
  render() {
    const {props} = this;
    const {rect, children} = props;
    // const props = Object.assign({}, this.props);
    // delete props.rect;
    return (
      <div
        {...props.dom}
        className={rect.name}
        style={Object.assign({
          position: 'absolute',
          top: `${rect.y * 100 - rect.height / 2 * 100}%`,
          right: `${(1 - rect.x) * 100 - rect.width / 2 * 100}%`,
          bottom: `${(1 - rect.y) * 100 - rect.height / 2 * 100}%`,
          left: `${rect.x * 100 - rect.width / 2 * 100}%`,
        }, props.dom && props.dom.style)}>
        {children}
      </div>
    );
  }

  static update() {
    return update.object({
      x: update.constant(0),
      y: update.constant(0),
      width: update.constant(100),
      height: update.constant(100),
    });
  }

  static animate(box, duration) {
    const object = {};
    for (const property of box.properties) {
      const keyframes = property.keyframes;
      const firstFrame = (keyframes.length > 0) ? keyframes[0] : {time: 0, value: property.default || 0};
      const lastFrame = (keyframes.length > 0) ? keyframes[keyframes.length - 1] : {time: 0, value: property.default || 0};
      object[property.name] = [
        animate.seconds((firstFrame.time + 1) / 30)
          .frame(animate.value(() => firstFrame.value)),
        ...keyframes.slice(0, keyframes.length - 1).map((frame, index) => (
          animate.seconds((keyframes[index + 1].time - frame.time) / 30)
            .frame(animate.value(() => frame.value))
        )),
        animate.seconds((duration - lastFrame.time) / 30)
          .frame(animate.value(() => lastFrame.value)),
        animate.seconds(0.001).frame(animate.value(() => lastFrame.value)),
      ];
      object[property.name] = animate.keyframes(object[property.name]);
    }
    return animate.object(object);
  }

  static present(box) {
    return present.style({
      transform: present.concat([
        present.translate([present.key('x').percent(), present.key('y').percent()]),
        present.scale([present.key('width').div(present.constant(100)), present.key('height').div(present.constant(100))]),
      ]),
    });
  }
}

export default Box;
