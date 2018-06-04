class Keyframe {
  constructor(time, value, easing, format) {
    // in seconds
    this.time = time;
    // ???
    this.value = value;
    // easing function from last frame to here: linear, easeIn, easeOut, ease
    this.easing = easing;
    // b2e, relative to end, absolute
    this.format = format;
  }
}
class Value {
  constructor() {
    this.keyframes = [];
  }
}
class Box {
  constructor() {
    this.name = name;
    this.values = {};
  }
}
class TimeCursor {
}
class Timeline {
  constructor() {
    this.lines = {};
    this.cursor = null;

    this.boxBegin = null;
    this.boxEnd = null;

    this.dom = null;

    this.data = {
      store: null,
      state: null,
      begin: null,
      end: null,
      animated: null,
    };
  }

  static stuFromJson() {
    // made by boxes per json?
  }

  async recordBegin() {
    await Promise.resolve();

    this.render(this.boxBegin);

    await Promise.resolve();

    this.animation.update(this.data.begin)
  }

  recordEnd() {
    
  }

  recordChange() {
    
  }

  freezeAt() {
    
  }
}
