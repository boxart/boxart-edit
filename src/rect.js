class Rect {
  constructor(
    {type = null, x = 0.5, y = 0.5, width = 1, height = 1} = {},
    children = []
  ) {
    this.type = type;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.children = children;
  }

  addChild(child) {
    return new Rect(this, this.children.concat(child));
  }

  assign(source) {
    return new Rect(Object.assign({}, this, source), this.children);
  }

  freeze() {
    Object.freeze(this);
    return this;
  }

  removeChild(index) {
    return new Rect(this, [].concat(this.children.slice(0, index), this.children.slice(index + 1)));
  }

  thaw() {
    return new Rect(this, this.children.map(child => child.thaw()));
  }

  updateChild(index, child) {
    return new Rect(this, [].concat(this.children.slice(0, index), child, this.children.slice(index + 1)));
  }
}

export default Rect;
