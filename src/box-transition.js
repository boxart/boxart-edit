import {h, Component} from 'preact';

import {update, animate, present} from 'boxart-functions';

class BoxTransition extends Component {
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
      x: update.rect().asElement(update.value((state, rect) => (rect.left + rect.right) / 2)),
      y: update.rect().asElement(update.value((state, rect) => (rect.top + rect.bottom) / 2)),
      width: update.rect().asElement(update.property('width')),
      height: update.rect().asElement(update.property('height')),
    });
  }

  static animate(box) {
    return animate.object({
      x: animate.begin().to(animate.end()),
      y: animate.begin().to(animate.end()),
      width: animate.begin().to(animate.end()),
      height: animate.begin().to(animate.end()),
    });
  }

  static present(box) {
    return present.style({
      transform: present.concat([
        present.translate([present.key('x').to(present.end).px(), present.key('y').to(present.end).px()]),
        present.scale([present.key('width').over(present.end), present.key('height').over(present.end)]),
      ]),
    });
  }
}

export default Box;
