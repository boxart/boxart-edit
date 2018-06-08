const EASING = {
  LINEAR: 'linear',
  EASE_IN: 'easeIn',
  EASE_OUT: 'easeOut',
  EASE: 'ease',
};

const FORMAT = {
  BEGIN_TO_END: 'beginToEnd',
  ABSOLUTE: 'absolute',
};

class Keyframe {
  constructor({time = 0, value = 0, easing = EASING.LINEAR, format = FORMAT.ABSOLUTE}) {
    // in 30 frames a second
    this.time = time;
    // ???
    this.value = value;
    // easing function from last frame to here: linear, easeIn, easeOut, ease
    this.easing = easing;
    // b2e, relative to end, absolute
    this.format = format;
  }

  assign(frame) {
    return new Keyframe(Object.assign({}, this, frame));
  }
}

class Property {
  constructor() {
    this.name = name;
    this.keyframes = [];
  }

  _changeKeyframes(time, newFrame) {
    return new Property(Object.assign({}, this, {
      keyframes: [
        ...this.keyframes.filter(key => key.time !== time),
        newFrame,
      ]
      .filter(Boolean)
      .sort((a, b) => a.time - b.time),
    }));
  }

  _findFrame(time) {
    return (this.keyframes.find(key => key.time === time) || new Property({time}));
  }

  addFrame(frame) {
    return this._changeKeyframes(frame.time, this._findFrame(frame.time).assign(frame));
  }

  changeFrame(time, frame) {
    return this._changeKeyframes(time, this._findFrame(time).assign(frame));
  }

  removeFrame(time, frame) {
    return this._changeKeyframes(time, null);
  }
}

class Box {
  constructor() {
    this.name = name;
    this.properties = [];
  }

  _changeProperties(propertyName, newProperty) {
    return new Box(Object.assign({}, this, {
      properties: [
        ...this.properties.filter(prop => prop.name !== propertyName),
        newProperty,
      ].filter(Boolean),
    }));
  }

  _findProperty(propertyName) {
    return (this.properties.find(prop => prop.name === propertyName) || new Property({name: propertyName}));
  }

  addProperty(propertyName) {
    return this._changeProperties(propertyName, this._findProperty(propertyName));
  }

  removeProperty(propertyName) {
    return this._changeProperties(propertyName, null);
  }

  addFrame(frame) {
    return this._changeProperties(propertyName, this._findProperty(propertyName).addFrame(frame));
  }

  changeFrame(time, frame) {
    return this._changeProperties(propertyName, this._findProperty(propertyName).changeFrame(time, frame));
  }

  removeFrame(time) {
    return this._changeProperties(propertyName, this._findProperty(propertyName).removeFrame(time));
  }
}

class Animation {
  constructor() {
    this.boxes = [];
  }

  static stuFromJson() {
    // made by boxes per json?
  }

  get duration() {
    return this.boxes.reduce((carry, box) => {
      return box.properties.reduce((carry, prop) => {
        return prop.keyframes.reduce((carry, key) => {
          return Math.max(key, carry);
        }, carry);
      }, carry);
    }, 0);
  }

  _changeBoxes(boxName, newBox) {
    return new Animation(Object.assign({}, this, {
      boxes: [
        ...this.boxes.filter(box => box.name !== boxName),
        newBox,
      ],
    }));
  }

  _findBox(boxName) {
    return (
      this.boxes.find(box => box.name === boxName) ||
      new Box({name: boxName})
    );
  }

  addProperty(boxName, propertyName) {
    return this._changeBoxes(boxName, this._findBox(boxName).addProperty(propertyName));
  }

  removeProperty(boxName, propertyName) {
    return this._changeBoxes(boxName, this._findBox(boxName).removeProperty(propertyName));
  }

  addFrame(boxName, propertyName, frame) {
    return this._changeBoxes(boxName, this._findBox(boxName).addFrame(propertyName, frame));
  }

  changeFrame(boxName, propertyName, time, frame) {
    return this._changeBoxes(boxName, this._findBox(boxName).changeFrame(propertyName, time, frame));
  }

  removeFrame(boxName, propertyName, time) {
    return this._changeBoxes(boxName, this._findBox(boxName).removeFrame(propertyName, time));
  }
}

export default Animation;

export {
  EASING,
  FORMAT,
};
