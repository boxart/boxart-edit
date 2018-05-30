import {h, Component} from 'preact';

import Rect from './rect';
import RectRender from './rect-render';
import RectValues from './rect-values';
import RectHierarchy from './rect-hierarchy';

const noop = () => {};

class RectEditor extends Component {
  constructor() {
    super();

    this.state = {
      pasteMode: 'paste',
      rect: Rect.fromJson(JSON.parse(localStorage.lastRect || JSON.stringify(new Rect()))),
      path: [],
    };

    this.updateChild = this.updateChild.bind(this);
    this.changePasteMode = this.changePasteMode.bind(this);
    this.resetRect = this.resetRect.bind(this);
    this.selectRect = this.selectRect.bind(this);
    this.updateSelect = this.updateSelect.bind(this);
  }

  componentDidMount() {
    document.addEventListener('copy', event => {
      event.clipboardData.setData('text/plain', JSON.stringify(this.getRect(this.state.path)));
      event.preventDefault();
    });
    document.addEventListener('paste', event => {
      if (this.state.pasteMode === 'paste') {
        this.addSelect(Rect.fromJson(JSON.parse(event.clipboardData.getData('text/plain'))));
      }
      else {
        this.updateSelect(Rect.fromJson(JSON.parse(event.clipboardData.getData('text/plain'))));
      }
      event.preventDefault();
    });
  }

  componentDidUpdate() {
    localStorage.lastRect = JSON.stringify(this.state.rect);
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

  resetRect() {
    this.setState({
      rect: new Rect(),
    });
  }

  changePasteMode() {
    this.setState({
      pasteMode: this.state.pasteMode === 'paste' ? 'overwrite' : 'paste',
    });
  }

  selectRect(...path) {
    console.log(path);
    this.setState({
      path,
    });
  }

  updateChild(rect) {
    this.setState({
      rect,
    });
  }

  operateSelect(fn) {
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

    parent = fn(parents, parent);

    while (parents.length) {
      parent = parents.pop().updateChild(path[parents.length], parent);
    }
    this.setState({
      rect: parent,
    });
  }

  addSelect(rect) {
    this.operateSelect((parents, parent) => {
      return parent.addChild(rect);
    });
  }

  updateSelect(rect) {
    this.operateSelect((parents, parent) => {
      return rect;
    });
  }

  render() {
    const selectRect = this.getRect(this.state.path);
    return (
      <div>
        <div style={{
          position: 'absolute',
          top: '0px',
          right: '33%',
          bottom: '0px',
          left: '0px',
        }}>
          <RectRender rect={this.state.rect} selectRect={this.selectRect} updateChild={this.updateChild} removeChild={noop} />
        </div>
        <div style={{
          position: 'absolute',
          top: '0px',
          right: '16%',
          bottom: '0px',
          left: '67%',
        }}>
          <RectValues rect={selectRect} update={this.updateSelect} />
        </div>
        <div style={{
          position: 'absolute',
          top: '0px',
          right: '0px',
          bottom: '0px',
          left: '84%',
        }}>
          <RectHierarchy pasteMode={this.state.pasteMode} rect={this.state.rect} changePasteMode={this.changePasteMode} resetRect={this.resetRect} selectRect={this.selectRect} />
        </div>
      </div>
    );
  }
}

export default RectEditor;
