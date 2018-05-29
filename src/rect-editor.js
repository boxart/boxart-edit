import {h, Component} from 'preact';

import Rect from './rect';
import RectRender from './rect-render';
import RectValues from './rect-values';

const noop = () => {};

class RectEditor extends Component {
  constructor() {
    super();

    this.state = {
      rect: new Rect(),
      path: [],
    };

    this.updateChild = this.updateChild.bind(this);
    this.selectRect = this.selectRect.bind(this);
    this.updateSelect = this.updateSelect.bind(this);
  }

  getRect(path) {
    let rect = this.state.rect;
    for (let i = 0; i < path.length; i++) {
      if (rect.children.length <= path[i]) {
        break;
      }
      rect = rect.children[path[i]];
    }
    return rect;
  }

  selectRect(...path) {
    this.setState({
      path,
    });
  }

  updateChild(rect) {
    this.setState({
      rect,
    });
  }

  updateSelect(rect) {
    let top = this.state.rect;
    let parent = top;
    const parents = [];
    const path = this.state.path;
    for (let i = 0; i < path.length; i++) {
      if (parent.children.length <= path[i]) {
        return;
      }
      parents.push(parent);
      parent = parent.children[path[i]];
    }
    // parents.push(rect);
    parent = rect;
    while (parents.length) {
      parent = parents.pop().updateChild(path[parents.length], parent);
    }
    console.log(path, top, parent, rect);
    this.setState({
      rect: parent,
    });
  }

  render() {
    const selectRect = this.getRect(this.state.path);
    return (
      <div>
        <div style={{
          position: 'absolute',
          top: '0px',
          right: '16%',
          bottom: '0px',
          left: '0px',
        }}>
          <RectRender rect={this.state.rect} selectRect={this.selectRect} updateChild={this.updateChild} removeChild={noop} />
        </div>
        <div style={{
          position: 'absolute',
          top: '0px',
          right: '0px',
          bottom: '0px',
          left: '84%',
        }}>
          <RectValues rect={selectRect} update={this.updateSelect} />
        </div>
      </div>
    );
  }
}

export default RectEditor;
